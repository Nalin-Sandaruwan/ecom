import { Router } from "express";
import { signup, login, refresh, logout, forgotPassword, verifyOTP, resetPassword } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

// 1. Rate Limiting for all auth routes
router.use(authLimiter);

// 2. Global Protection with Public Exception Handling
// (The protect middleware automatically allows routes like /signup, /login, etc.)
router.use(protect);

// --- Unified Auth Routes ---
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// --- Password Reset Routes ---
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Example protected route for testing
router.get("/me", (req, res) => {
  res.status(200).json({
    status: "success",
    user: req.user,
  });
});

export default router;
