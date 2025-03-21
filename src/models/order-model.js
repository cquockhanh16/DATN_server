const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: "pawnProuct",
      },
    },
  ],
  interest_rate: {
    type: Number,
    default: 0.1,
  },
  term: {
    type: Number,
  },
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  staff_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("Order", orderSchema);
