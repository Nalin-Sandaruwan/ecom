import { Router } from "express";
import { createCategory, getAllCategories } from "../controllers/category.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

// Public route to get categories
router.get("/", getAllCategories);

// Admin only route to create categories
router.post("/", protect, restrictTo(UserRole.ADMIN), createCategory);

export default router;
