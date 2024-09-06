import { Response } from "express";
import { UserModel } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";
import CURRENCIES from "../constants/currencies";
import { body, validationResult } from "express-validator";
import { Transaction } from "../interfaces";

// clase transfer instanciando con el usuario y el targuet
const handleTransfer = async (
  identifier: string,
  identifierField: "alias" | "cbu",
  currencyId: string,
  amount: number,
  req: AuthenticatedRequest,
  res: Response
) => {
  const targetUser = await UserModel.findOne({ [identifierField]: identifier });
  if (!targetUser) {
    return res
      .status(404)
      .json({ message: "Target user do not belong to this bank" });
  }
  if (amount <= 0) {
    return res
      .status(400)
      .json({ message: "The transaction amount must be greater than 0" });
  }
  if (req.user.accounts[currencyId].amount < amount) {
    return res.status(400).json({ message: "Insufficient funds" });
  }
  const transaction: Transaction = {
    [identifierField]: targetUser[identifierField],
    amount: -Number(amount),
    currency: CURRENCIES[currencyId],
  };

  const targetTransaction: Transaction = {
    [identifierField]: req.user[identifierField],
    amount: Number(amount),
    currency: CURRENCIES[currencyId],
  };

  try {
    await UserModel.updateOne(
      {
        [identifierField]: req.user[identifierField],
        "accounts.currency": CURRENCIES[currencyId],
      },
      {
        $set: {
          "accounts.$.amount":
            req.user.accounts[currencyId].amount - Number(amount),
        },
        $push: {
          transactions: transaction,
        },
      }
    );

    await UserModel.updateOne(
      {
        [identifierField]: targetUser[identifierField],
        "accounts.currency": CURRENCIES[currencyId],
      },
      {
        $set: {
          "accounts.$.amount":
            targetUser.accounts[currencyId].amount + Number(amount),
        },
        $push: {
          transactions: targetTransaction,
        },
      }
    );

    res.json({ message: "Transaction successful", transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postTransferByAlias = [
  body("alias").isString().notEmpty(),
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { alias, currencyId, amount } = req.body;
    try{
      const transaction = await handleTransfer(alias, "alias", currencyId, amount, req, res);
      res.json({ message: "Transaction successful", transaction });
    } catch(error){
      res.status(error.status || 500).json({ message: error.message})
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
    await handleTransfer(cbu, "cbu", currencyId, amount, req, res);
  },
];

export { postTransferByAlias, postTransferByCBU };
