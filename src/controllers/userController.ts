import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";
import CURRENCIES from "../constants/currencies";
import { body, validationResult } from "express-validator";
import { matchPassword } from "../helpers/authHelper";
import bcrypt from "bcrypt";

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req: Request, res: Response) => {
  const { clientId } = req.query;
  try {
    const user = await UserModel.findOne({ clientId: Number(clientId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBalance = async (req: AuthenticatedRequest, res: Response) => {
  const { dolar } = req.query;
  const currencyId = dolar ? 1 : 0;
  try {
    res.json({
      currency: req.user.accounts[currencyId].currency.identifier,
      balance: req.user.accounts[currencyId].amount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const putUserBalance = [
  body("currencyId").isNumeric().notEmpty(),
  body("amount").isNumeric().notEmpty(),
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { currencyId, amount } = req.body;
    const newBalance = req.user.accounts[currencyId].amount + Number(amount);
    if (newBalance < 0) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    try {
      const result = await UserModel.updateOne(
        {
          clientId: req.user.clientId,
          "accounts.currency": CURRENCIES[currencyId],
        },
        {
          $set: {
            "accounts.$.amount": newBalance,
          },
          $push: {
            transactions: {
              amount: Number(amount),
              currency: CURRENCIES[currencyId],
            },
          },
        }
      );
      res.status(201).json({
        message: amount > 0 ? "Deposit succsesful" : "Withdrawal succsesful",
        currency: req.user.accounts[currencyId].currency.identifier,
        newBalance: newBalance,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

const getUserPin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      pin: req.user.pin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const putUserPin = [
  body("pin").isNumeric().isLength({ min: 4, max: 4 }),
  async (req: AuthenticatedRequest, res: Response) => {
    const { pin } = req.body;
    try {
      const result = await UserModel.updateOne(
        {
          clientId: req.user.clientId,
        },
        {
          $set: {
            pin,
          },
        }
      );
      res.status(201).json({
        message: "Update succsesful",
        newPin: pin,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

const getUserAlias = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      alias: req.user.alias,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const putUserAlias = [
  body("alias").isString(),
  async (req: AuthenticatedRequest, res: Response) => {
    const { alias } = req.body;
    if (/\d/.test(alias)) {
      return res
        .status(400)
        .json({ errors: "The new alias can't have numbers" });
    }
    const splitAlias = alias.split(".");
    if (
      splitAlias.length != 3 ||
      splitAlias[0].length == 0 ||
      splitAlias[1].length == 0 ||
      splitAlias[2].length == 0
    ) {
      return res
        .status(400)
        .json({ errors: "The new alias can't have numbers" });
    }
    try {
      const result = await UserModel.updateOne(
        {
          clientId: req.user.clientId,
        },
        {
          $set: {
            alias,
          },
        }
      );
      res.status(201).json({
        message: "Update succsesful",
        newAlias: alias,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

const getUserCBU = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      cbu: req.user.cbu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserTransactions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { count, currency } = req.query;
  let transactions = req.user.transactions.reverse();
  if (
    currency == CURRENCIES[0].identifier ||
    currency == CURRENCIES[1].identifier
  ) {
    transactions = transactions.filter(
      (transaction) => transaction.currency.identifier == currency
    );
  }
  if (count && transactions.length > Number(count)) {
    transactions = transactions.slice(0, Number(count));
  }
  try {
    res.json({
      transactions: transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const putUserPassword = [
  body("newPassword").isString().isLength({ min: 8 }).notEmpty(),
  ,
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { newPassword } = req.body;

    try {
      const user = await UserModel.findById(req.user.clientId);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export {
  getUsers,
  getUser,
  getUserBalance,
  getUserAlias,
  getUserPin,
  putUserBalance,
  putUserAlias,
  putUserPin,
  getUserCBU,
  getUserTransactions,
  putUserPassword,
};
