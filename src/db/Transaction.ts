import mongoose from 'mongoose';
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  alias: String,
  amout: {
    type: Number,
    required: true,
  },
  cbu: Number,
  currencyId: {
    type: Number,
    required: true,
  },
});

export default TransactionSchema;