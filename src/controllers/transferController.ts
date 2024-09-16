import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { body, validationResult } from "express-validator";
import { handleTransfer } from "../services/transferServices";

const postTransferByAlias = [
  body("alias").isString().notEmpty(),
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { alias, currencyId, amount } = req.body;
    try {
      const transaction = await handleTransfer(
        alias,
        "alias",
        currencyId,
        amount,
        req.user
      );
      res.json({ message: "Transaction successful", transaction });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  },
];

const postTransferByCBU = [
  body("cbu").isString().notEmpty(),
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { cbu, currencyId, amount } = req.body;
    try {
      const transaction = await handleTransfer(
        cbu,
        "cbu",
        currencyId,
        amount,
        req.user
      );
      res.json({ message: "Transaction successful", transaction });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  },
];

export { postTransferByAlias, postTransferByCBU };
