const express = require("express");
const multer = require("multer");
const router = express.Router();
const { storage } = require("../configs/upload-config");
const upload = multer({ storage: storage });
const UserController = require("../controllers/user-controller");

router.post("/register", upload.single("image"), UserController.register);

router.get("/user/list", UserController.getListUser);

router.get("/user", UserController.findUserByField);

router.patch(
  "/user/update/:id",
  upload.single("image"),
  UserController.updateUserField
);

module.exports = router;
