const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/order-controller");

router.post("/order/create", OrderController.createOrder);

router.get("/order/list", OrderController.getListOrderByCustomerField);

module.exports = router;
