import { Request, Response, NextFunction } from "express";
import { User } from "../interfaces";
import jwt from "jsonwebtoken";
import { matchPassword } from "../helpers/authHelper";
import { UserModel } from "../models/User";
import { body, validationResult } from "express-validator";

interface AuthenticatedRequest extends Request {
  clientId: number;
  user?: User;
}

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT || "manteca");
    req.clientId = decoded.clientId;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const authenticatePassword = [
  body("password").isString().isLength({ min: 8 }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await UserModel.findOne({ clientId: req.user.clientId });
    await matchPassword(res, user, req.body.password);
    try {
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export { authenticateToken, AuthenticatedRequest, authenticatePassword };
