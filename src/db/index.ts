import AccountSchema from "./Account";
import UserSchema from "./User";
import CurrencySchema from "./Currency";
import TransactionSchema from "./Transaction";

import mongoose from "mongoose";

export const Account = mongoose.model("Account", AccountSchema);
export const User = mongoose.model("User", UserSchema);
export const Currency = mongoose.model("Currency", CurrencySchema);
export const Transaction = mongoose.model("Transaction", TransactionSchema);

export default {
  Account,
  User,
  Currency,
  Transaction,
};
