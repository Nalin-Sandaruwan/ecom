import { Request, Response, NextFunction } from "express";
import Order, { PaymentStatus } from "../models/Order";
import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import os from "os";

/**
 * Get Global Admin Statistics
 */
export const getAdminStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Total Revenue (Paid Orders Only)
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: PaymentStatus.PAID } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // 2. Global Users Count
    const totalUsers = await User.countDocuments();

    // 3. New Orders (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newOrders = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // 4. System Load (CPU usage + memory proxy)
    const cpuLoad: number = os.loadavg()[0] ?? 0; // 1-minute load average
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memUsage = ((totalMem - freeMem) / totalMem) * 100;

    // Combine it into a visible "System Load" percentage
    const systemLoad = (cpuLoad * 10 + memUsage) / 2;

    res.status(200).json({
      status: "success",
      data: {
        metrics: {
          totalRevenue,
          globalUsers: totalUsers,
          newOrders,
          systemLoad: parseFloat(systemLoad.toFixed(1)),
        },
      },
    });
  },
);
