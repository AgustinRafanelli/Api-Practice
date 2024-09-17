import CURRENCIES from "../constants/currencies";
import { Transaction } from "../interfaces";
import { UserModel } from "../models/User";

export class HTTPError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "HTTPError";
  }
}

export const handleTransfer = async (
  identifier: string,
  identifierField: "alias" | "cbu",
  currencyId: number,
  amount: number,
  user: any
) => {
  const targetUser = await UserModel.findOne({ [identifierField]: identifier });
  if (!targetUser) {
    throw new HTTPError("Target user do not belong to this bank", 404);
  }
  if (amount <= 0) {
    throw new HTTPError("The transaction amount must be greater than 0", 400);
  }
  if (user.accounts[currencyId].amount < amount) {
    throw new HTTPError("Insufficient funds", 400);
  }
  const transaction: Transaction = {
    [identifierField]: targetUser[identifierField],
    amount: -Number(amount),
    currency: CURRENCIES[currencyId],
  };

  const targetTransaction: Transaction = {
    [identifierField]: user[identifierField],
    amount: Number(amount),
    currency: CURRENCIES[currencyId],
  };

  const session = await UserModel.startSession();
  session.startTransaction();

  try {
    await UserModel.updateOne(
      {
        [identifierField]: user[identifierField],
        "accounts.currency": CURRENCIES[currencyId],
      },
      {
        $set: {
          "accounts.$.amount":
            user.accounts[currencyId].amount - Number(amount),
        },
        $push: {
          transactions: transaction,
        },
      }
    );

    await UserModel.updateOne(
      {
        [identifierField]: targetUser[identifierField],
        "accounts.currency": CURRENCIES[currencyId],
      },
      {
        $set: {
          "accounts.$.amount":
            targetUser.accounts[currencyId].amount + Number(amount),
        },
        $push: {
          transactions: targetTransaction,
        },
      }
    );
    await session.commitTransaction();
    return transaction;
  } catch (error) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};
