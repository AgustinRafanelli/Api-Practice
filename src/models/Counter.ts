import { Schema, model, Document } from "mongoose";

interface CounterDocument extends Document {
  _id: string;
  sequenceValue: number;
}

const CounterSchema = new Schema<CounterDocument>({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, required: true },
});

const Counter = model<CounterDocument>("Counter", CounterSchema);

export default Counter;
