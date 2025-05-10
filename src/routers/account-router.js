const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/account-controller");

router.get("/account/list", AccountController.getListAccount);

router.post("/account/lock", AccountController.lockAccount);

router.get("/account/detail", AccountController.getDetailAccount);

// router.get("/user", UserController.findUserByField);

// router.patch(
//   "/user/update/:id",
//   upload.single("image"),
//   UserController.updateUserField
// );

module.exports = router;
