// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const expressRateLimit = require("express-rate-limit");
const app = express();
const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request trong 15 phút
});

const connectDB = require("./configs/db-config");

const userRouter = require("./routers/user-router");

// Middleware
app.use(express.json()); // Phân tích JSON request body
app.use(express.urlencoded({ extended: true })); // Phân tích URL-encoded request body
app.use(cors({ credentials: true }));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(limiter);

// Routes
app.use("/api", userRouter);

connectDB();

app.use((req, res) => {
  return res
    .status(404)
    .json({ sts: false, err: "API not declared!!", data: null });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    sts: false,
    err: error.message || "Error from server",
    data: null,
  });
});

// Export app để sử dụng trong file server.js
module.exports = app;
