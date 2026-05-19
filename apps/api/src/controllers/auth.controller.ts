import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser, UserRole } from "../models/User";
import AuditLog from "../models/AuditLog";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utils";
import { sendEmail, generateOTPTemplate, generateWelcomeTemplate } from "../utils/email.utils";
import crypto from "crypto";

// --- Base Signup logic ---
const baseSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
  enforcedRole?: UserRole,
): Promise<void> => {
  const { name, email, password, phone } = req.body;
  let { role } = req.body;

  // 1. Admin Protection: Super-Admin Token
  if (enforcedRole === UserRole.ADMIN) {
    const superAdminToken = req.headers["x-super-admin-token"];
    if (superAdminToken !== process.env.SUPER_ADMIN_TOKEN) {
      await AuditLog.create({
        action: "ADMIN_SIGNUP_ATTEMPT",
        status: "failure",
        details: `Unauthorized admin signup attempt for ${email}`,
        ip: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      });
      return next(
        new AppError("Invalid super-admin initialization token", 403),
      );
    }
  }

  // Role Enforcement
  if (enforcedRole) {
    role = enforcedRole;
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Account already exists with this email", 400));
  }

  // Determine the final role and active status
  const userRole = role || UserRole.USER;
  // Farmers are now active by default for streamlined onboarding
  const isActive = 
    userRole === UserRole.USER || 
    userRole === UserRole.ADMIN || 
    userRole === UserRole.FARMER;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: userRole,
    isActive,
  });

  // Audit Log for sensitive roles
  if (role === UserRole.ADMIN) {
    await AuditLog.create({
      userId: user._id as any,
      action: "ADMIN_SIGNUP",
      status: "success",
      ip: req.ip || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
    });
  }

  // Send a background Welcome email (Non-blocking)
  try {
    sendEmail({
      email: user.email,
      subject: "Welcome to WoodenGallery!",
      message: `Hello ${user.name},\n\nThank you for signing up to WoodenGallery! We are thrilled to welcome you to our curated sanctuary of premium, minimalist wood art handcrafted in Sri Lanka.\n\nExplore our collections here: ${process.env.CLIENT_URL || 'http://127.0.0.1:5000'}/shop`,
      html: generateWelcomeTemplate(user.name),
    }).catch(err => console.error("❌ Background Welcome Email Error:", err));
  } catch (err) {
    console.error("❌ Welcome Email Trigger Error:", err);
  }

  res.status(201).json({
    status: "success",
    message: "Registration successful! You can now log in.",
  });
};

/**
 * Base Login logic - Enhanced with Lockout and MFA
 */
const baseLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
  requiredRole?: UserRole,
): Promise<void> => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email }).select(
    "+password +loginAttempts +lockUntil",
  );

  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  // 1. Check for Account Lockout
  if (user.lockUntil && user.lockUntil > new Date()) {
    const remainingTime = Math.ceil(
      (user.lockUntil.getTime() - Date.now()) / 60000,
    );
    return next(
      new AppError(
        `Account is temporarily locked. Try again in ${remainingTime} minutes.`,
        423,
      ),
    );
  }

  // Verify Password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    // 2. Handle Failed Attempt (Lockout)
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 mins
      user.loginAttempts = 0;

      await AuditLog.create({
        userId: user._id as any,
        action: "ACCOUNT_LOCKOUT",
        status: "failure",
        details: `Account locked for ${email} due to 5 failed attempts`,
        ip: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      });
    }
    await user.save();

    // Log the failed login attempt
    await AuditLog.create({
      userId: user._id as any,
      action: "LOGIN_FAILURE",
      status: "failure",
      details: `Failed login attempt for ${email}`,
      ip: req.ip || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
    });

    return next(new AppError("Invalid credentials", 401));
  }

  // 3. Status Checks
  if (!user.isActive) {
    return next(
      new AppError("Your account is pending review or set as inactive.", 403),
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return next(new AppError(`Access denied for role: ${user.role}`, 403));
  }

  // 4. Successful Login Logic
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  // Audit Log for success
  if (user.role === UserRole.ADMIN) {
    await AuditLog.create({
      userId: user._id as any,
      action: "ADMIN_LOGIN_SUCCESS",
      status: "success",
      ip: req.ip || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
    });
  }

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    status: "success",
    user: { id: user._id, name: user.name, role: user.role },
  });
};

// --- Unified Auth Exports ---
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) =>
    baseSignup(req, res, next),
);
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) =>
    baseLogin(req, res, next),
);

// Refresh Access Token
export const refresh = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError("No refresh token provided", 401));
    }

    // Verify token
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    );

    // Find user and check if token matches
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError("Invalid refresh token", 403));
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      status: "success",
    });
  },
);

/**
 * Logout
 */
export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded: any = jwt.decode(refreshToken);
      if (decoded && decoded.id) {
        await User.findByIdAndUpdate(decoded.id, {
          $unset: { refreshToken: 1 },
        });
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  },
);

/**
 * Forgot Password - Send OTP
 */
export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;

  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with that email address", 404));
  }

  // 2. Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  
  // 3. Save hashed OTP and expiry to DB
  user.passwordResetOTP = crypto.createHash("sha256").update(otp).digest("hex");
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await user.save({ validateBeforeSave: false });

  // 4. Send email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset OTP (Valid for 10 min)",
      message: `Your password reset code is ${otp}`,
      html: generateOTPTemplate(otp),
    });

    res.status(200).json({
      status: "success",
      message: "OTP sent to email!",
    });
  } catch (err) {
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email. Try again later!", 500));
  }
});

/**
 * Verify OTP
 */
export const verifyOTP = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, otp } = req.body;

  // 1. Hash the incoming OTP
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  // 2. Find user with valid OTP and expiration
  const user = await User.findOne({
    email,
    passwordResetOTP: hashedOTP,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return next(new AppError("OTP is invalid or has expired", 400));
  }

  res.status(200).json({
    status: "success",
    message: "OTP verified! You can now reset your password.",
  });
});

/**
 * Reset Password
 */
export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, otp, password } = req.body;

  // 1. Hash the incoming OTP
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  // 2. Find user with valid OTP and expiration
  const user = await User.findOne({
    email,
    passwordResetOTP: hashedOTP,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return next(new AppError("Verification failed. OTP may have expired.", 400));
  }

  // 3. Update password and clear OTP fields
  user.password = password;
  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;
  user.loginAttempts = 0; // Reset login attempts on password change
  user.lockUntil = undefined;

  await user.save();

  // 4. Log the audit event
  await AuditLog.create({
    userId: user._id as any,
    action: "PASSWORD_RESET_SUCCESS",
    status: "success",
    ip: req.ip || "unknown",
    userAgent: req.headers["user-agent"] || "unknown",
  });

  res.status(200).json({
    status: "success",
    message: "Password reset successful! You can now log in with your new password.",
  });
});
