import mongoose from 'mongoose';
const { Schema } = mongoose;

const CurrencySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
});

export default CurrencySchema