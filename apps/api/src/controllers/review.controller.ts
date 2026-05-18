import { Request, Response, NextFunction } from "express";
import Review from "../models/Review";
import Order, { OrderStatus } from "../models/Order";
import Product from "../models/Product";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

/**
 * Create a new Review (User only, Verified Purchase only)
 */
export const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { productId, rating, review, orderId } = req.body;
  const userId = req.user?._id;

  if (!orderId) {
    return next(new AppError("Order ID is required to publish a chronicle.", 400));
  }

  // 1. Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // 2. Check if user has already reviewed this product FOR THIS SPECIFIC ORDER
  const existingReview = await Review.findOne({ productId, userId, orderId });
  if (existingReview) {
    return next(new AppError("You have already reviewed this purchase instance.", 400));
  }

  // 3. VERIFIED PURCHASE CHECK (Strictly tied to the provided orderId)
  const completedOrder = await Order.findOne({
    _id: orderId,
    userId,
    status: OrderStatus.COMPLETED,
    "items.product": productId,
  });

  if (!completedOrder) {
    return next(
      new AppError("You can only review products from a completed artisanal harvest belonging to your account.", 403)
    );
  }

  // 4. Create the review
  const newReview = await Review.create({
    review,
    rating,
    productId,
    userId,
    orderId,
  });

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

/**
 * Get all reviews for a product (Public)
 */
export const getProductReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  const reviews = await Review.find({ productId })
    .populate("userId", "name")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

/**
 * Update a Review (Owner only)
 */
export const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  const userId = req.user?._id;

  const existingReview = await Review.findById(id);

  if (!existingReview) {
    return next(new AppError("Review not found", 404));
  }

  // Check ownership
  if (!userId || existingReview.userId.toString() !== userId.toString()) {
    return next(new AppError("You only can update your own reviews", 403));
  }

  existingReview.rating = rating || existingReview.rating;
  existingReview.review = review || existingReview.review;

  await existingReview.save();

  res.status(200).json({
    status: "success",
    data: {
      review: existingReview,
    },
  });
});

/**
 * Delete a Review (Owner only)
 */
export const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const review = await Review.findById(id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  // Check ownership
  if (!userId || review.userId.toString() !== userId.toString()) {
    return next(new AppError("You only can delete your own reviews", 403));
  }

  await Review.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
