import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";

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
  try {
    if (!dolar) {
      res.json({
        currency: req.user.accounts[0].currency.identifier,
        balance: req.user.accounts[0].amount,
      });
    } else {
      res.json({
        currency: req.user.accounts[1].currency.identifier,
        balance: req.user.accounts[1].amount,
      });
    }
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

export { getUsers, getUser, getUserBalance, getUserAlias, getUserPin, getUserCBU };
