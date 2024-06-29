import { Router } from "express";
import {
  getUsers,
  getUser,
  getUserBalance,
  getUserAlias,
  getUserPin,
  getUserCBU,
} from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";
import { getUserFromRequest } from "../helpers/authHelper";

const router = Router();

router.get("/users", getUsers);
router.get("/user", getUser);
router.get("/user/balance", authenticateToken, getUserFromRequest, getUserBalance);
router.get("/user/alias", authenticateToken, getUserFromRequest, getUserAlias);
router.get("/user/pin", authenticateToken, getUserFromRequest, getUserPin);
router.get("/user/cbu", authenticateToken, getUserFromRequest, getUserCBU);

export default router;
