const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  phone_number: {
    type: String,
    minLength: 10,
    maxLength: 11,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  identity_card: {
    type: String,
    required: true,
    unique: true,
  },
  identity_card_image: String,
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
