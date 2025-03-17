// configs/db-config.js
const mongoose = require("mongoose");
// const path = require("path");
// require("dotenv").config({
//   path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
// });
require("dotenv").config();

const connectDB = async () => {
  try {
    // Kết nối đến MongoDB sử dụng URI từ biến môi trường
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    // Thoát ứng dụng nếu kết nối thất bại
    process.exit(1);
  }
};

module.exports = connectDB;
