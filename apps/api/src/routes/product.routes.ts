import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
  approveProduct,
  getAllProductsAdmin,
} from "../controllers/product.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";
import { upload } from "../config/cloudinary.config";

const router = Router();

// Public routes
router.get("/", getAllProducts);

// Protected routes (Farmer only) - MUST be before /:id to avoid collision
router.get("/farmer", protect, restrictTo(UserRole.FARMER), getFarmerProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  restrictTo(UserRole.FARMER),
  upload.fields([
    { name: "images", maxCount: 2 },
  ]),
  createProduct,
);

router
  .route("/:id")
  .patch(
    protect,
    restrictTo(UserRole.FARMER),
    upload.fields([
      { name: "images", maxCount: 2 },
    ]),
    updateProduct,
  )
  .delete(protect, restrictTo(UserRole.FARMER), deleteProduct);

router.patch(
  "/approve/:id",
  protect,
  restrictTo(UserRole.ADMIN),
  approveProduct,
);
router.get(
  "/admin/all",
  protect,
  restrictTo(UserRole.ADMIN),
  getAllProductsAdmin,
);

export default router;
