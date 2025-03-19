const Order = require("../models/order-model");
const User = require("../models/user-model");
const UserService = require("./user-service");
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");
class OrderService {
  static createOrder = (body) => {
    return new Promise((res, rej) => {
      const { products, interest_rate, term, customer_id, staff_id } = body;
      if (!customer_id) {
        rej("Customer is empty!");
      }
      UserService.findUserById(customer_id)
        .then((data) => {
          if (!data) {
            rej("Customer not found");
          }
          const newOrder = new Order();
          newOrder.products = products;
          interest_rate ? (newOrder.interest_rate = interest_rate) : "";
          term ? (newOrder.term = term) : "";
          newOrder.customer_id = customer_id;
          staff_id ? (newOrder.staff_id = staff_id) : "";
          newOrder
            .save()
            .then((data) => res(data))
            .catch((err) => rej(err));
        })
        .catch((err) => rej(err));
    });
  };

  static getListOrderByCustomerField = (query) => {
    return new Promise((res, rej) => {
      //   if (id === undefined || id.trim() === "") {
      //     rej("Customer id is empty!");
      //   }
      const option = {};
      if (query.phone_number) option.phone_number = query.phone_number;
      if (query.identity_card) option.identity_card = query.identity_card;
      if (Object.keys(option).length === 0) {
        rej("Field is empty");
      }
      User.findOne(option).then((user) => {
        if (!user) {
          rej("Customer is not found");
        }
        Order.find({ customer_id: user._id })
          .populate({
            path: "products.product_id",
            select: "product_name estimated_value",
          })
          .select("-customer_id")
          .then((data) => {
            if (!data) {
              rej("Order is not found");
            }
            res({ orders: data, customer: user });
          })
          .catch((err) => rej(err));
      });
    });
  };

  static getListOrder = (query) => {
    return new Promise((res, rej) => {
      const { page, limit } = query;
      const pageOrder = page || DATA_PAGE;
      const limitOrder = limit || LIMIT_DATA_PAGE;
      Order.find()
        .skip((pageOrder - 1) * limitOrder)
        .limit(limitOrder)
        .then((data) => {
          Order.countDocuments()
            .then((count) => {
              res({
                total_page: Math.ceil(count / limitOrder),
                current_page: +pageOrder,
                data,
              });
            })
            .catch((err) => rej(err));
        })
        .catch((err) => rej(err));
    });
  };

  static getDetailOrderById = (id) => {
    return new Promise((res, rej) => {
      Order.findById(id)
        .populate({
          path: "products.product_id",
          select: "product_name estimated_value",
        })
        .populate({
          path: "customer_id",
          select: "name",
        })
        .then((data) => {
          if (!data) {
            rej("Order not found");
          }
          res(data);
        })
        .catch((err) => rej(err));
    });
  };
}

module.exports = OrderService;
