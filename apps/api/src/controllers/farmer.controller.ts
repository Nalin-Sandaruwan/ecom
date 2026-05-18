import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Order, { OrderStatus } from "../models/Order";
import Product from "../models/Product";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

/**
 * Get Farmer Dashboard Statistics
 */
export const getFarmerStats = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const farmerId = req.user?._id;

  if (!farmerId) {
    return next(new AppError("User not authenticated", 401));
  }

  const farmerObjectId = new mongoose.Types.ObjectId(farmerId.toString());

  // 1. Total Revenue (from completed orders)
  const revenueData = await Order.aggregate([
    { $match: { status: OrderStatus.COMPLETED } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo"
      }
    },
    { $unwind: "$productInfo" },
    { $match: { "productInfo.farmerId": farmerObjectId } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }
    }
  ]);

  // 2. Active Orders (unique orders that are not completed or cancelled)
  const activeOrdersData = await Order.aggregate([
    { 
      $match: { 
        status: { $in: [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.DELIVERING] } 
      } 
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo"
      }
    },
    { $unwind: "$productInfo" },
    { $match: { "productInfo.farmerId": farmerObjectId } },
    {
      $group: {
        _id: "$_id"
      }
    },
    { $count: "count" }
  ]);

  // 3. Total Products
  const totalProducts = await Product.countDocuments({ farmerId: farmerObjectId });

  // 4. Unique Customers
  const customersData = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo"
      }
    },
    { $unwind: "$productInfo" },
    { $match: { "productInfo.farmerId": farmerObjectId } },
    {
      $group: {
        _id: "$userId"
      }
    },
    { $count: "count" }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      activeOrders: activeOrdersData[0]?.count || 0,
      totalProducts,
      uniqueCustomers: customersData[0]?.count || 0
    }
  });
});
