import { Document, Schema, model } from "mongoose";
import { User } from "../interfaces";
import Counter from "./Counter";
import { createCBU } from "../utils/cbu";

interface UserDocument extends Document, User {}

const UserSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: Number,
    unique: true,
  },
  cbu: {
    type: String,
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
          required: true,
        },
        identifier: {
          type: String,
          required: true,
        },
      },
      amount: {
        type: Number,
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
      cbu: String,
      currency: {
        name: {
          type: String,
          required: true,
        },
        identifier: {
          type: String,
          required: true,
        },
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
    {
      default: [],
    },
  ],
});

UserSchema.pre("save", async function (next) {
  const doc = this as UserDocument;

  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "clientId" },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true }
    );

    doc.clientId = counter.sequenceValue;
    doc.cbu = createCBU(counter.sequenceValue);
  }

  next();
});

const UserModel = model<UserDocument>("User", UserSchema);

export { UserModel, UserDocument };
