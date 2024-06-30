import { Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";

const getUserFromRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.clientId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findOne({ clientId: req.clientId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { getUserFromRequest };
