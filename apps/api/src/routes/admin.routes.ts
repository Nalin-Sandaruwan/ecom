import { Router } from "express";
import { getAdminStats } from "../controllers/admin.controller";
import { getAllAuditLogs } from "../controllers/audit.controller";
import { 
  getAllUsers, 
  getUser, 
  updateUser, 
  deleteUser 
} from "../controllers/user.controller";
import { 
  getAllProducts, 
  deleteProduct 
} from "../controllers/product.controller";
import { 
  getAllOrders, 
  getOrder, 
  updateOrderStatus 
} from "../controllers/order.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

/**
 * All admin routes are protected and restricted to ADMIN role
 */
router.use(protect);
router.use(restrictTo(UserRole.ADMIN));

router.get("/stats", getAdminStats);
router.get("/audit-logs", getAllAuditLogs);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/products", getAllProducts);
router.delete("/products/:id", deleteProduct);

// Order Management
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrder);
router.patch("/orders/:id/status", updateOrderStatus);

export default router;
