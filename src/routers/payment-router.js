const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment-controller");

router.post("/create_payment_url", PaymentController.CreatePaymentUrl);

module.exports = router;
