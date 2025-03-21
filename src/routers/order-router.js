const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/order-controller");

router.post("/order/create", OrderController.createOrder);

router.get("/order/list-customer", OrderController.getListOrderByCustomerField);

router.get("/order/list", OrderController.getListOrder);

router.get("/order/detail/:id", OrderController.getDetailOrderById);

router.patch("/order/update/:id", OrderController.updateOrderField);

router.get("/order/file-pdf/:id", OrderController.getOrderFilePDF);

module.exports = router;
