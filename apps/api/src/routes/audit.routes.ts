import { Router } from "express";
import { getAllAuditLogs } from "../controllers/audit.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

// Protect all routes - Admin only
router.use(protect);
router.use(restrictTo(UserRole.ADMIN));

router.get("/", getAllAuditLogs);

export default router;
