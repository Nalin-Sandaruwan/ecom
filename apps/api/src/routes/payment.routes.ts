import express, { Router } from "express";
import {
  createCheckoutSession,
  handleStripeWebhook,
} from "../controllers/payment.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

/**
 * STRIPE WEBHOOK
 * IMPORTANT: This must be mounted BEFORE any global body-parsers that convert to JSON
 * as Stripe needs the raw body for signature verification.
 */
router.post(
  "/webhook", 
  express.raw({ type: "application/json" }), 
  handleStripeWebhook
);

// Everything below this line requires Authentication
router.use(protect);

/**
 * Checkout Session Creation
 * User only.
 */
router.post(
  "/create-checkout-session/:orderId",
  restrictTo(UserRole.USER),
  createCheckoutSession
);

export default router;
