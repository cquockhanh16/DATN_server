const express = require("express");

const router = express.Router();
const UserController = require("../controllers/user-controller");

router.post("/register", UserController.register);

router.get("/user/list", UserController.getListUser);

router.get("/user/field", UserController.findUserByField);

router.patch("/user/update/:id", UserController.updateUserField);

module.exports = router;
