import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getMyOrders,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/order.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

// All order routes require authentication
router.use(protect);

// Public/General order retrieval
router.get("/", getAllOrders);

// Get current user's orders
router.get("/mine", restrictTo(UserRole.USER), getMyOrders);

//Restrict to orders getting only the user placed orders
router.get("/user/:id", restrictTo(UserRole.USER), getMyOrders);

//restrict to user and farmer
router.get("/:id", restrictTo(UserRole.FARMER, UserRole.USER), getOrder);

// User only: Create order
router.post("/", restrictTo(UserRole.USER), createOrder);

// Farmer only: Update, Delete, Status update
router.patch("/:id", restrictTo(UserRole.FARMER), updateOrder);
router.delete("/:id", restrictTo(UserRole.FARMER), deleteOrder);
router.patch("/:id/status", restrictTo(UserRole.FARMER), updateOrderStatus);

export default router;
