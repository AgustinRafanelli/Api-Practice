import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import Counter from "./Counter";
import { User } from "../interfaces";
import { createCBU } from "../utils/cbu";

interface UserDocument extends Document, User {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  clientId: { type: Number, unique: true },
  cbu: { type: String, unique: true },
  password: { type: String, required: true },
  alias: { type: String, required: true, unique: true },
  pin: { type: Number, required: true },
  accounts: [
    {
      currency: {
        name: { type: String, required: true },
        identifier: { type: String, required: true },
      },
      amount: { type: Number, default: 0 },
    },
  ],
  transactions: [
    {
      alias: String,
      amount: { type: Number, required: true },
      cbu: String,
      currency: {
        name: { type: String, required: true },
        identifier: { type: String, required: true },
      },
      date: { type: Date , default: new Date()},
    },
  ],
});

UserSchema.pre("save", async function (next) {
  const doc = this as UserDocument;

  if (doc.isNew) {
    const salt = await bcrypt.genSalt(10);
    doc.password = await bcrypt.hash(doc.password, salt);

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

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model<UserDocument>("User", UserSchema);

export { UserModel, UserDocument };
