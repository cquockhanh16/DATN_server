const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    enum: ["off", "on", "lock"],
    default: "off",
  },
  failed_login_attempts: {
    type: Number,
    default: 0,
  },
  locktime: {
    type: Number,
  },
  opentime: {
    type: Number,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("Account", accountSchema);
