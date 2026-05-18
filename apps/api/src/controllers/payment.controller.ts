import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import Order, { OrderStatus, PaymentStatus } from "../models/Order";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

/**
 * Create a Stripe Checkout Session for an Order
 */
export const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // Ensure only the order owner can pay
    if (order.userId.toString() !== (req as any).user?._id.toString()) {
      return next(
        new AppError("You do not have permission to pay for this order", 403),
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.items.map((item: any) => ({
        price_data: {
          currency: "lkr", // Updated to LKR for regional commerce
          product_data: {
            name: item.product.productName,
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/cart`,
      customer_email: (req as any).user?.email as string,
      client_reference_id: orderId as string,
      metadata: {
        orderId: String(orderId),
      },
    });

    // Save the Session ID to the order
    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({
      status: "success",
      sessionUrl: session.url,
    });
  },
);

/**
 * Handle Stripe Webhooks (Automated status updates)
 */
export const handleStripeWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: any;

    console.log("🔔 Webhook received! Signature:", sig ? "Present" : "Missing");

    try {
      event = stripe.webhooks.constructEvent(
        req.body, // This must be the raw body
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
      console.log("✅ Webhook verified! Event type:", event.type);
    } catch (err: any) {
      console.error(`❌ Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.metadata?.orderId;

      console.log(
        "📦 Processing checkout.session.completed for Order:",
        orderId,
      );

      if (orderId) {
        // Update order status
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = PaymentStatus.PAID;
          order.status = OrderStatus.PREPARING; // Automatically move to preparing after payment
          await order.save();
          console.log(`🎉 Order ${orderId} successfully updated to PAID.`);
        } else {
          console.error(`❌ Order ${orderId} not found in database.`);
        }
      } else {
        console.warn("⚠️ No orderId found in session metadata.");
      }
    }

    res.json({ received: true });
  },
);
