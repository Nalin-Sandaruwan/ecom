import { Request, Response, NextFunction } from "express";
import Category from "../models/Category";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

/**
 * Create a new Category (Admin only)
 */
export const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return next(new AppError("Category already exists", 400));
  }

  const category = await Category.create({ name, description });

  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

/**
 * Get all Categories (Public)
 */
export const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});
