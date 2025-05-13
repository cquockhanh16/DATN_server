const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema({
  content: {
    type: String,
  },
  customer_id: String,
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("Account", accountSchema);
