const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment-controller");

router.post("/create_payment_url", PaymentController.CreatePaymentUrl);

router.post("/momo/ipn", PaymentController.MomoIPNHandler);

module.exports = router;
