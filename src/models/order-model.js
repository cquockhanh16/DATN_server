const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
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
      value: {
        type: Number,
        default: 6,
      },
      unit: {
        type: String,
        enum: ["days", "months", "years"],
        default: "months",
      },
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    staff_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
