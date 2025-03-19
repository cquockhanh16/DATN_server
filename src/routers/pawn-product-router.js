const express = require("express");
const router = express.Router();

const PawnProductController = require("../controllers/pawn-product-controller");

router.post("/pawn-product/create", PawnProductController.createPawnProduct);

router.get(
  "/pawn-product/list-customer",
  PawnProductController.getListPawnProductByCustomerField
);

router.get("/pawn-product/list", PawnProductController.getListPawnProduct);

router.get(
  "/pawn-product/detail/:id",
  PawnProductController.getDetailPawnProductById
);

router.patch(
  "/pawn-product/update/:id",
  PawnProductController.updatePawnProduct
);

module.exports = router;
