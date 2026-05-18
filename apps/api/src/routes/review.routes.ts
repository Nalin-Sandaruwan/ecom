import { Router } from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

// Public route: Get all reviews for a product
router.get("/product/:productId", getProductReviews);

// Protected routes (Authenticated Users only)
router.use(protect);

// Only role 'user' can create reviews (as per requirement)
router.post("/", restrictTo(UserRole.USER), createReview);

// Users can update/delete their own reviews (Ownership check is in controller)
router.patch("/:id", restrictTo(UserRole.USER), updateReview);
router.delete("/:id", restrictTo(UserRole.USER), deleteReview);

export default router;
