import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.config";
import authRoutes from "./routes/auth.routes";
import farmerProfileRoutes from "./routes/farmerProfile.routes";
import userRoutes from "./routes/user.routes";
import auditRoutes from "./routes/audit.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import reviewRoutes from "./routes/review.routes";
import cartRoutes from "./routes/cart.routes";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import farmerRoutes from "./routes/farmer.routes";
import { globalErrorHandler } from "./middleware/error.middleware";
import AppError from "./utils/appError";

// Configuration
// (dotenv was moved to top)

// Connect to Database
connectDB();

const app: Express = express();
const port = process.env.PORT || 5000;

/**
 * Middleware setup
 */
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
); // Enable CORS with credentials
app.use(cookieParser()); // Cookie parser

// Payment Routes (Mounted before JSON parser for Webhook RAW body support)
app.use("/api/v1/payments", paymentRoutes);

app.use(express.json()); // JSON parser
app.use(express.urlencoded({ extended: true })); // URL-encoded parser

// Auth Routes
app.use("/api/v1/auth", authRoutes);

// Farmer Profile Routes
app.use("/api/v1/farmer-profiles", farmerProfileRoutes);

// User Routes
app.use("/api/v1/users", userRoutes);

// Audit Routes
app.use("/api/v1/audit-logs", auditRoutes);

// Category Routes
app.use("/api/v1/categories", categoryRoutes);

// Product Routes
app.use("/api/v1/products", productRoutes);

// Order Routes
app.use("/api/v1/orders", orderRoutes);

// Review Routes
app.use("/api/v1/reviews", reviewRoutes);

// Cart Routes
app.use("/api/v1/cart", cartRoutes);

// Admin Routes
app.use("/api/v1/admin", adminRoutes);

// Farmer Routes
app.use("/api/v1/farmer", farmerRoutes);

// Health Check
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to ChilleBazzar API");
});

// 404 Handler for undefined routes
app.all("/*path", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

//Server Initialization
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
