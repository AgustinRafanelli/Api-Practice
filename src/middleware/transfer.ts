import { Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import CURRENCIES from "../constants/currencies";
import PINLIMIT from "../constants/pinLimit";
import { AuthenticatedRequest } from "./auth";

const pinAuth = [
  body("currencyId").isNumeric().notEmpty(),
  body("amount").isNumeric().notEmpty(),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const currencyId = Number(req.body.currencyId);
    const amount = Number(req.body.amount);
    const pin = Number(req.body.pin);
    try {
      if (
        (currencyId == 0 || currencyId == 1) &&
        amount > PINLIMIT[currencyId]
      ) {
        if (!pin) {
          return res.status(401).json({
            message: `Unauthorized, pin needs to be provided for transactions highter than ${
              CURRENCIES[currencyId].identifier + " " + PINLIMIT[currencyId]
            }`,
          });
        }
        if (pin != req.user.pin) {
          return res.status(401).json({ message: "Unauthorized, wrong pin" });
        }
      }
      req.body;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export { pinAuth };
