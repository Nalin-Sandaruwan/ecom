import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import AuditLog from "../models/AuditLog";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

/**
 * Get all users (Admin only)
 */
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  },
);

/**
 * Get specific user (Admin only)
 */
export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  },
);

/**
 * Update user (Admin only)
 * Can be used to change roles, activate/deactivate accounts, etc.
 */
export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  },
);

/**
 * Update current user's profile
 */
export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400,
        ),
      );
    }

    const filteredBody: any = {};
    const allowedFields = ["name", "phone"];
    Object.keys(req.body).forEach((el) => {
      if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return next(
        new AppError(
          "User not found or update failed. Please log in again.",
          401,
        ),
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  },
);

/**
 * Delete user (Admin only)
 */
export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Prevent self-deletion
    if (req.params.id === req.user?._id.toString()) {
      return next(new AppError("You cannot delete your own admin account", 400));
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    // 2. Log the deletion before sending response
    try {
      await AuditLog.create({
        userId: req.user?._id,
        action: "USER_DELETE",
        status: "success",
        details: `Deleted user: ${user.name} (${user.email})`,
        ip: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      });
    } catch (logError) {
      console.error("Audit log creation failed:", logError);
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
