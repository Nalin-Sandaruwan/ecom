import { Router } from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

// Protected routes for all users
router.patch("/me", protect, updateMe);

// Restrict all routes to admin only
router.use(restrictTo(UserRole.ADMIN));

router.route("/")
  .get(getAllUsers);

router.route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
