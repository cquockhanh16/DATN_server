const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    phone_number: {
      type: String,
      minLength: 10,
      maxLength: 11,
    },
    address: {
      type: String,
      required: true,
    },
    identity_card: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
