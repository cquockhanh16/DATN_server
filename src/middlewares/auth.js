const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const { SECRET_KEY_JWT } = process.env;

// middleware để kiểm tra người dùng đã đăng nhập vào hệ thống hay chưa
const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    next("Bạn cần đăng nhập để thực hiện các chức năng của trang web");
  }
  jwt.verify(token, SECRET_KEY_JWT, (err, user) => {
    // nếu có lỗi thì thông báo ra lỗi
    if (err) {
      next("Không đủ thẩm quyền");
    }
    // nếu đã đăng nhập thì sẽ chạy các route tiếp theo và gửi kèm theo req một user.
    req.user = user;
    next();
  });
};

module.exports = auth;
