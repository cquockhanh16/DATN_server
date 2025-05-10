const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transaction-controller");

router.get("/transaction/list", TransactionController.getListTransaction);

module.exports = router;
