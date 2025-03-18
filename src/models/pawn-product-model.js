const mongoose = require("mongoose");
const { Schema } = mongoose;

const pawnProuctSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_image: {
      type: String,
    },
    estimated_value: {
      type: Number,
      required: true,
    },
    sale_price: {
      type: Number,
    },
    product_condition: {
      type: String,
      enum: ["new", "used"],
      default: "new",
    },
    product_status: {
      type: String,
      enum: ["active", "expired", "liquidated"],
      default: "active",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pawnProuct", pawnProuctSchema);
