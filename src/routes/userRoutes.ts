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

const router = Router();

router.get("/users", getUsers);
router.get("/user", getUser);
router.get("/user/balance", authenticateToken, getUserBalance);
router.get("/user/alias", authenticateToken, getUserAlias);
router.get("/user/pin", authenticateToken, getUserPin);
router.get("/user/cbu", authenticateToken, getUserCBU);

export default router;
