import { Request, Response, NextFunction } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

/**
 * Get current user's cart
 */
export const getCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId) {
    return next(new AppError("User not authenticated", 401));
  }

  let cart = await Cart.findOne({ userId }).populate({
    path: "items.product",
    select: "productName price imageURIs productType quantity"
  });

  if (!cart) {
    // Create an empty cart if it doesn't exist
    cart = await Cart.create({ userId: req.user?._id, items: [] });
  } else if (cart.items && cart.items.length > 0) {
    // Automatically clean up deleted/null products from cart
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item: any) => item.product !== null);
    if (cart.items.length !== originalLength) {
      await cart.save();
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

/**
 * Add item to cart or update quantity
 */
export const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new AppError("Product ID is required", 400));
  }

  // Check if product exists and has enough stock
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  let cart = await Cart.findOne({ userId: req.user?._id });

  if (!cart) {
    cart = await Cart.create({ 
      userId: req.user?._id, 
      items: [{ product: productId, quantity }] 
    });
  } else {
    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Update quantity
      const existingItem = cart.items[itemIndex];
      if (existingItem) {
        existingItem.quantity += quantity;
      }
    } else {
      // Add new item
      cart.items.push({ product: productId as any, quantity });
    }
    await cart.save();
  }

  // Populate and return
  await cart.populate({
    path: "items.product",
    select: "productName price imageURIs productType quantity"
  });

  if (cart.items && cart.items.length > 0) {
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item: any) => item.product !== null);
    if (cart.items.length !== originalLength) {
      await cart.save();
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

/**
 * Update item quantity explicitly
 */
export const updateCartItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return next(new AppError("Product ID and quantity are required", 400));
  }

  if (quantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  const cart = await Cart.findOne({ userId: req.user?._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex === -1) {
    return next(new AppError("Item not found in cart", 404));
  }

  const existingItem = cart.items[itemIndex];
  if (existingItem) {
    existingItem.quantity = quantity;
  }
  await cart.save();

  await cart.populate({
    path: "items.product",
    select: "productName price imageURIs productType quantity"
  });

  if (cart.items && cart.items.length > 0) {
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item: any) => item.product !== null);
    if (cart.items.length !== originalLength) {
      await cart.save();
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

/**
 * Remove item from cart
 */
export const removeFromCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: req.user?._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();

  await cart.populate({
    path: "items.product",
    select: "productName price imageURIs productType quantity"
  });

  if (cart.items && cart.items.length > 0) {
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item: any) => item.product !== null);
    if (cart.items.length !== originalLength) {
      await cart.save();
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

/**
 * Clear cart
 */
export const clearCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ userId: req.user?._id });
  
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});
