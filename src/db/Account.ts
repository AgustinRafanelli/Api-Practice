import mongoose from 'mongoose';
const { Schema } = mongoose;

const AccountSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  currencyId: {
    type: Number,
    required: true,
  },
  ammount: {
    type: Number,
    required: true,
  },
});

export default AccountSchema;