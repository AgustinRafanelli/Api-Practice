import { Router } from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import authRoutes from "./authRoutes";
import { authenticateToken } from "../middleware/auth";
import { getUserFromRequest } from "../helpers/authHelper";

const router = Router();

router.use("/", authRoutes);
router.use("/user", authenticateToken, getUserFromRequest, userRoutes);
router.use("/admin", adminRoutes);

export default router;
