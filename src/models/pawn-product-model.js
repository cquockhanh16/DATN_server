const mongoose = require("mongoose");
const { Schema } = mongoose;

const pawnProuctSchema = new Schema({
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
    enum: ["active", "expired", "redeemed", "liquidated"],
    default: "active",
  },
  pawn_date: {
    type: Number,
    required: true,
  },
  interest_rate: {
    type: Number,
    default: 0.1,
  },
  term: {
    type: Number,
    required: true,
  },
  holding_months: {
    type: [], // Mảng chứa các giá trị hỗn hợp (có thể là số, chuỗi, đối tượng, v.v.)
  },
  product_quantity: {
    type: Number,
    default: 1,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("pawnProduct", pawnProuctSchema);
