import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cbu: {
    type: Number,
    required: true,
  },
  alias: {
    type: Number,
    required: true,
  },
});

export default UserSchema;