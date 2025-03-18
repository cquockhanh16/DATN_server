const express = require("express");
const router = express.Router();

const PawnProductController = require("../controllers/pawn-product-controller");

router.post("/pawn-product/create", PawnProductController.createPawnProduct);

module.exports = router;
