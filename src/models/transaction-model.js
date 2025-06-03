const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  customerId: { type: String, required: true }, // Mã khách hàng
  productId: { type: String, required: true }, // Mã sản phẩm
  amount: { type: Number, required: true }, // Số tiền
  status: {
    type: String,
    enum: ["pending", "success", "failed", "cancelled"],
    default: "pending",
  }, // Trạng thái
  createdAt: { type: Date, default: () => Date.now() }, // Thời gian tạo
  note: { type: String }, // Ghi chú
  message: { type: String }, // Message từ cổng thanh toán
  paymentMethod: { type: String }, // Phương thức thanh toán (Momo, VNPay...)
  transactionCode: { type: String }, // Mã giao dịch từ cổng thanh toán
  payType: { type: String },
  orderId: { type: String }, // Mã đơn hàng của bạn
  transactionType: {
    type: String,
    enum: ["pawn", "interest_payment", "redeem", "liquidation"],
    default: "pawn",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
