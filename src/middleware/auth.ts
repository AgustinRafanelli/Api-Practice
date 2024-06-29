import { Request, Response, NextFunction } from "express";
import { User } from "../interfaces";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
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
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export { authenticateToken, AuthenticatedRequest };
