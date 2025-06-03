const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transaction-controller");

router.get("/transaction/list", TransactionController.getListTransaction);

router.get(
  "/transaction/admin/list",
  TransactionController.getListTransactionAdmin
);

router.get(
  "/transaction/statistics",
  TransactionController.transactionStatistics
);

module.exports = router;
