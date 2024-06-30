import { Router } from "express";
import {
  getUserBalance,
  getUserAlias,
  getUserPin,
  getUserCBU,
  getUserTransactions,
} from "../controllers/userController";
import { pinAuth } from "../middleware/transfer"
import transferRoutes from "./transferRoutes"

const router = Router();

router.get("/balance", getUserBalance);
router.get("/alias", getUserAlias);
router.get("/pin", getUserPin);
router.get("/cbu", getUserCBU);
router.get("/transactions", getUserTransactions);

router.use("/transfer", pinAuth, transferRoutes);

export default router;
