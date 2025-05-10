const express = require("express");
const multer = require("multer");
const router = express.Router();
const { storage } = require("../configs/upload-config");
const upload = multer({ storage: storage });
const auth = require("../middlewares/auth");

const PawnProductController = require("../controllers/pawn-product-controller");

router.post(
  "/pawn-product/create",
  upload.single("image"),
  PawnProductController.createPawnProduct
);

router.get(
  "/pawn-product/list-customer",
  auth,
  PawnProductController.getListPawnProductByCustomerField
);

router.get("/pawn-product/list", PawnProductController.getListPawnProduct);

router.get(
  "/pawn-product/detail/:id",
  PawnProductController.getDetailPawnProductById
);

router.patch(
  "/pawn-product/update/:id",
  upload.single("image"),
  PawnProductController.updatePawnProduct
);

module.exports = router;
