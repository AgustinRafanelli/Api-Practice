import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";
import CURRENCIES from "../constants/currencies";

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

const getUserPin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      pin: req.user.pin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserAlias = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      alias: req.user.alias,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export {
  getUsers,
  getUser,
  getUserBalance,
  getUserAlias,
  getUserPin,
  getUserCBU,
  getUserTransactions,
};
