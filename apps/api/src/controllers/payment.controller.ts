import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";

// Note: Stripe integrations have been completely removed as requested.
// This project uses Bank Wire Transfer as the primary checkout and payment method.

/**
 * Create a Stripe Checkout Session for an Order
 * (Disabled for maintenance / Stripe removed)
 */
export const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
      status: "error",
      message: "Stripe card payment has been permanently disabled on this server. Please use Bank Wire Transfer instead.",
    });
  }
);

/**
 * Handle Stripe Webhooks
 * (Disabled for maintenance / Stripe removed)
 */
export const handleStripeWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
      status: "error",
      message: "Stripe webhook endpoints are deactivated on this server.",
    });
  }
);
