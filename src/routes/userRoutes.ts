import { Router } from "express";
import {
  getUserBalance,
  getUserAlias,
  getUserPin,
  putUserBalance,
  putUserAlias,
  putUserPin,
  getUserCBU,
  getUserTransactions,
} from "../controllers/userController";
import { pinAuth } from "../middleware/transfer";
import transferRoutes from "./transferRoutes";
import { authenticatePassword } from "../middleware/auth";

const router = Router();

router.get("/balance", getUserBalance);
router.put("/balance", pinAuth, putUserBalance);
router.get("/alias", getUserAlias);
router.put("/alias", authenticatePassword, putUserAlias);
router.get("/pin", getUserPin);
router.put("/pin", authenticatePassword, putUserPin);
router.get("/cbu", getUserCBU);
router.get("/transactions", getUserTransactions);

router.use("/transfer", pinAuth, transferRoutes);

export default router;
