const http = require("http");
const app = require("./src/app"); // Import app từ file app.js
// const path = require("path");
// require("dotenv").config({
//   path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
// });

require("dotenv").config();

// Thiết lập port
const port = process.env.PORT || 3000;

// Tạo server
const server = http.createServer(app);

// Khởi động server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
