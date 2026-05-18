import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { generateAccessToken } from "../utils/token.utils";

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Protect routes - ensures user is authenticated with a valid access token
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Bypass public routes
    const publicPaths = ["/signup", "/login", "/refresh", "/logout", "/forgot-password", "/verify-otp", "/reset-password"];
    const path = req.path.replace(/\/$/, "");
    if (publicPaths.some((p) => path.endsWith(p))) {
      return next();
    }

    // 2. Extract access token from cookies
    let accessToken = req.cookies.accessToken;

    // 3. If access token is missing, attempt silent refresh
    if (!accessToken) {
      const isRefreshed = await attemptSilentRefresh(req, res);
      if (isRefreshed) {
        return next();
      }
      res
        .status(401)
        .json({ message: "Please log in to access this resource" });
      return;
    }

    try {
      // 4. Verify access token
      const decoded: any = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
      );

      // 5. Find user
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        res
          .status(401)
          .json({ message: "User no longer exists or is inactive" });
        return;
      }

      req.user = user;
      next();
    } catch (err: any) {
      // 6. If access token is expired, attempt silent refresh
      if (err.name === "TokenExpiredError") {
        const isRefreshed = await attemptSilentRefresh(req, res);
        if (isRefreshed) {
          return next();
        }
      }
      throw err; // Let the outer catch handle other types of errors
    }
  } catch (error: any) {
    res
      .status(401)
      .json({ message: "Authentication failed. Please log in again." });
  }
};

/**
 * Helper to attempt silent refresh using the refresh token cookie
 */
async function attemptSilentRefresh(
  req: Request,
  res: Response,
): Promise<boolean> {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return false;

    // Verify refresh token
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    );

    // Find user and check if refresh token matches
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken || !user.isActive) {
      return false;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    // Set new cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    // Attach user to request for the current flow
    req.user = user;
    return true;
  } catch (error) {
    return false;
  }
}
