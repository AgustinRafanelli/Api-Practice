import { Document, Schema, model } from "mongoose";

interface Currency {
  name: string;
  identifier: string;
}

interface Account {
  currency: Currency;
  amount?: number;
}

interface Transaction {
  alias?: string;
  amount: number;
  cbu?: number;
  currency: Currency;
  date: Date;
}

interface User {
  name: string;
  pin: number;
  cbu: number;
  alias: string;
  accounts: Account[];
  transactions: Transaction[];
}

interface UserDocument extends Document, User {}

const UserSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  cbu: {
    type: Number,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  accounts: [
    {
      currency: {
        name: {
          type: String,
          require: true,
        },
        identifier: {
          type: String,
          require: true,
        },
        require: true,
        unique: true,
      },
      amount: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
  transactions: [
    {
      alias: String,
      amount: {
        type: Number,
        required: true,
      },
      cbu: Number,
      currency: {
        name: {
          type: String,
          require: true,
        },
        identifier: {
          type: String,
          require: true,
        },
        require: true,
      },
      date:{
        default: Date.now()
      }
    },
  ],
});

const UserModel = model<UserDocument>("User", UserSchema);

export { UserModel, UserDocument, User, Account, Transaction, Currency };
