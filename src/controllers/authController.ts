import { Request, Response } from "express";
import { UserModel } from "../models/User";
import jwt from "jsonwebtoken";
import randomWords from "random-spanish-words";
import { body, validationResult } from "express-validator";
import CURRENCIES from "../constants/currencies";
import { matchPassword } from "../helpers/authHelper";

const registerUser = [
  body("name").isString().notEmpty(),
  body("surname").isString().notEmpty(),
  body("dni").isNumeric().notEmpty(),
  body("password").isString().isLength({ min: 8 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, surname, dni, password, pesos, dolares } = req.body;
    const alias = randomWords({ exactly: 3, join: "." });
    const pin = Math.floor(1000 + Math.random() * 9000);

    const newUser = new UserModel({
      name,
      surname,
      dni,
      alias,
      pin,
      password,
      accounts: [
        { currency: CURRENCIES[0], amount: pesos || 0 },
        { currency: CURRENCIES[1], amount: dolares || 0 },
      ],
      transactions: [],
    });

    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

const loginUser = [
  body("dni").isNumeric(),
  body("password").isString().isLength({ min: 8 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dni, password } = req.body;

    try {
      const user = await UserModel.findOne({ dni });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      matchPassword(res, user, password)

      const token = jwt.sign(
        { clientId: user.clientId },
        process.env.JWT || "manteca",
        { expiresIn: "1h" }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export { registerUser, loginUser };
