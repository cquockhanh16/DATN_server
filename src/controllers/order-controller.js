const OrderService = require("../services/order-service");

class OrderController {
  static createOrder = async (req, res, next) => {
    try {
      const { body } = req;
      const newOrder = await OrderService.createOrder(body);
      res.status(201).json({
        sts: true,
        data: newOrder,
        err: null,
        mes: "create order successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListOrderByCustomerField = async (req, res, next) => {
    try {
      const { phone_number, identity_card } = req.query;
      const listOrder = await OrderService.getListOrderByCustomerField({
        phone_number,
        identity_card,
      });
      res.status(200).json({
        sts: true,
        data: listOrder,
        err: null,
        mes: "get list order successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = OrderController;
