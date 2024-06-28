import { Request, Response } from "express";
import { UserModel } from "../models/User";
import randomWords from "random-spanish-words";
import CURRENCIES from "../constants/currencyes";

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req: Request, res: Response) => {
  const { name, surname, dni, pesos, dolares} = req.body;
  const alias = randomWords({ exactly: 3, join: "." });
  const pin = Math.floor(1000 + Math.random() * 9000);

  const newUser = new UserModel({
    name,
    surname,
    dni,
    alias,
    pin,
    accounts: [
      { currency: CURRENCIES[0], amount: pesos || 0 },
      { currency: CURRENCIES[1], amount: dolares || 0 },
    ],
    transactions: []
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getUsers, createUser };
