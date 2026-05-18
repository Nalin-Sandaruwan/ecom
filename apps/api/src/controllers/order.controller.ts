import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Order, { OrderStatus } from "../models/Order";
import Product from "../models/Product";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { UserRole } from "../models/User";

/**
 * Create a new Order (User only)
 */
export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { items, deliveryAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new AppError("Order must contain at least one item", 400));
  }

  // 1. Initial validation pass - Check all products first
  const orderItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product not found: ${item.product}`, 404));
    }

    if (item.quantity > product.quantity) {
      return next(new AppError(`Not enough stock for ${product.productName}. Available: ${product.quantity}`, 400));
    }

    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
      productTitle: product.productName, // local ref for rollback logging
    });
  }

  // 2. Execution pass - Deduct stock
  // Note: Without replica sets, we use sequential updates.
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: -item.quantity },
    });
  }

  // 3. Create the order
  try {
    const order = await Order.create({
      userId: req.user?._id,
      items: orderItems,
      totalPrice,
      deliveryAddress,
      status: OrderStatus.PENDING,
    });

    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (error: any) {
    console.error("❌ Order Creation Error:", error);
    return next(new AppError(error.message || "Failed to create order in database", 400));
  }
});

/**
 * Get all orders (Admin see all, Farmers see their stake, Users see their own)
 */
export const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let query: any = {};

  if (req.user?.role === UserRole.USER) {
    query = { userId: req.user._id };
  } else if (req.user?.role === UserRole.FARMER) {
    // 1. Find all product IDs belonging to this farmer
    const farmerProducts = await Product.find({ farmerId: req.user._id }).select("_id");
    const productIds = farmerProducts.map(p => p._id);

    // 2. Find orders where items contains any of these products
    query = { "items.product": { $in: productIds } };
  }

  const orders = await Order.find(query)
    .sort("-createdAt")
    .populate("userId", "name email phone")
    .populate("items.product", "productName price imageURIs");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

/**
 * Get a single order
 */
export const getOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id)
    .populate("userId", "name email phone")
    .populate("items.product", "productName price");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Authorize: Only the owner, a farmer, or an admin can see the order
  if (
    req.user?.role === UserRole.USER && 
    order.userId.toString() !== req.user._id.toString()
  ) {
    return next(new AppError("You do not have permission to view this order", 403));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

/**
 * Get orders for a specific user (User restricted to their own)
 */
export const getMyOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // If id is not in params, use the authenticated user's id (for /mine route)
  const id = req.params.id || req.user?._id.toString();

  if (!id) {
    return next(new AppError("User identification is required", 400));
  }

  // Security check: Users can only fetch their own orders
  if (req.user?.role === UserRole.USER && id !== req.user?._id.toString()) {
    return next(new AppError("You do not have permission to view these orders", 403));
  }

  const orders = await Order.find({ userId: id })
    .sort("-createdAt") // Newest first
    .populate("userId", "name email")
    .populate("items.product", "productName price images");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

/**
 * Update Order details (Farmer only)
 */
export const updateOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

/**
 * Update Order Status (Farmer only)
 */
export const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status: newStatus } = req.body;

  if (!Object.values(OrderStatus).includes(newStatus)) {
    return next(new AppError("Invalid order status", 400));
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const oldStatus = order.status;
  
  // Logic: Handle inventory based on status transition
  if (newStatus === OrderStatus.CANCELLED && oldStatus !== OrderStatus.CANCELLED) {
    // 1. Moving TO Cancelled -> Restore Stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { 
        $inc: { quantity: item.quantity } 
      });
    }
  } else if (oldStatus === OrderStatus.CANCELLED && newStatus !== OrderStatus.CANCELLED) {
    // 2. Moving FROM Cancelled -> Re-deduct Stock (Safety Check)
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product || product.quantity < item.quantity) {
        return next(new AppError(`Cannot re-activate order. Not enough stock for ${product?.productName || 'unknown product'}.`, 400));
      }
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }
  }

  order.status = newStatus;
  await order.save();

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

/**
 * Delete Order (Farmer only)
 */
export const deleteOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
