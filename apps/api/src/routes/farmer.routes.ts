import { Router } from "express";
import { getFarmerStats } from "../controllers/farmer.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

/**
 * All farmer dashboard routes are protected and restricted to FARMER role
 */
router.use(protect);
router.use(restrictTo(UserRole.FARMER));

router.get("/stats", getFarmerStats);

export default router;
