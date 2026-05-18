import { Router } from "express";
import {
  createProfile,
  getMyProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
} from "../controllers/farmerProfile.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

//  Protected Routes (Specific)
router.get("/me", protect, getMyProfile); 

//  Public Routes (Generic)
router.get("/:id", getProfileById);

//  Protected & Restricted Routes
router.use(protect);
router.use(restrictTo(UserRole.FARMER));

router.post("/", createProfile);
router.patch("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export default router;
