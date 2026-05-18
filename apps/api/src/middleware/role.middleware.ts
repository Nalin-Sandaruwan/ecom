import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User";

/**
 * Restrict access to specific roles
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(500).json({ message: "User not attached to request" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Role (${req.user.role}) is not authorized to access this resource`,
      });
      return;
    }

    next();
  };
};
