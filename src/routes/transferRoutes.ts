import { Router } from "express";
import {
  postTransferByAlias,
  postTransferByCBU,
} from "../controllers/transferController";

const router = Router();

router.post("/alias", postTransferByAlias);
router.post("/cbu", postTransferByCBU);

export default router;
