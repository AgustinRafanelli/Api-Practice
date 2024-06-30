import { Request, Response } from "express";
import { UserModel } from "../models/User";

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

export {
  getUsers,
  getUser,
};
