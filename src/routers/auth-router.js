const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth-controller");

router.post("/auth/login", AuthController.login);

// router.get("/user/list", UserController.getListUser);

// router.get("/user", UserController.findUserByField);

// router.patch(
//   "/user/update/:id",
//   upload.single("image"),
//   UserController.updateUserField
// );

module.exports = router;
