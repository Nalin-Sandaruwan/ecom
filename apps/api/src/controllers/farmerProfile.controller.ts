import { Request, Response, NextFunction } from "express";
import FarmerProfile from "../models/FarmerProfile";
import { UserRole } from "../models/User";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

/**
 * Create Farmer Profile
 */
export const createProfile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { farmName, description, address } = req.body;
  const userId = req.user?._id;

  // 1. Check if profile already exists
  const existingProfile = await FarmerProfile.findOne({ userId });
  if (existingProfile) {
    return next(new AppError("You already have a farmer profile", 400));
  }

  // 2. Create profile
  const profile = await FarmerProfile.create({
    farmName,
    description,
    address,
    userId,
  });

  res.status(201).json({
    status: "success",
    data: profile,
  });
});

/**
 * Get Current User's Profile
 */
export const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const profile = await FarmerProfile.findOne({ userId: req.user?._id });
  if (!profile) {
    return next(new AppError("Profile not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: profile,
  });
});

/**
 * Get Profile by ID
 */
export const getProfileById = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const profile = await FarmerProfile.findById(req.params.id).populate("userId", "name email phone");
  if (!profile) {
    return next(new AppError("Profile not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: profile,
  });
});

/**
 * Update Profile
 */
export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { farmName, description, address } = req.body;
  const profileId = req.params.id;

  // 1. Find profile
  const profile = await FarmerProfile.findById(profileId);
  if (!profile) {
    return next(new AppError("Profile not found", 404));
  }

  // 2. Verify ownership (unless Admin)
  if (profile.userId.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ADMIN) {
    return next(new AppError("You are not authorized to update this profile", 403));
  }

  // 3. Update
  profile.farmName = farmName || profile.farmName;
  profile.description = description || profile.description;
  profile.address = address || profile.address;

  await profile.save();

  res.status(200).json({
    status: "success",
    data: profile,
  });
});

/**
 * Delete Profile
 */
export const deleteProfile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const profileId = req.params.id;

  // 1. Find profile
  const profile = await FarmerProfile.findById(profileId);
  if (!profile) {
    return next(new AppError("Profile not found", 404));
  }

  // 2. Verify ownership (unless Admin)
  if (profile.userId.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ADMIN) {
    return next(new AppError("You are not authorized to delete this profile", 403));
  }

  // 3. Delete
  await profile.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Profile deleted successfully",
  });
});
