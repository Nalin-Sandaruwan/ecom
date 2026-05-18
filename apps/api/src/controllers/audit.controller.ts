import { Request, Response, NextFunction } from "express";
import AuditLog from "../models/AuditLog";
import catchAsync from "../utils/catchAsync";

/**
 * Get all audit logs (Admin only)
 */
export const getAllAuditLogs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 100;
  const skip = (page - 1) * limit;

  const logs = await AuditLog.find()
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "name email role");

  const total = await AuditLog.countDocuments();

  res.status(200).json({
    status: "success",
    results: logs.length,
    total,
    data: {
      logs,
    },
  });
});
