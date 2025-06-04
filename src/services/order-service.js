const fs = require("fs");
const Order = require("../models/order-model");
const User = require("../models/user-model");
const UserService = require("./user-service");
const { generatePDF } = require("../utils/generatePDF");
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");

class OrderService {
  static createOrder = (body) => {
    return new Promise((res, rej) => {
      const { products, interest_rate, term, customer_id, staff_id } = body;
      if (!customer_id) {
        rej("Customer is empty!");
      }
      UserService.findUserByField({ field: customer_id })
        .then((data) => {
          if (!data) {
            rej("Customer not found");
          }
          const newOrder = new Order();
          newOrder.products = products;
          interest_rate ? (newOrder.interest_rate = interest_rate) : "";
          term ? (newOrder.term = term) : "";
          newOrder.customer_id = data._id;
          staff_id ? (newOrder.staff_id = staff_id) : "";
          newOrder.created_at = new Date().getTime();
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
      const { page, limit } = query;
      const pageOrder = page || DATA_PAGE;
      const limitOrder = limit || LIMIT_DATA_PAGE;
      const option = {};
      // if (query.phone_number) option.phone_number = query.phone_number;
      if (query.identity_card) option.identity_card = query.identity_card;
      if (Object.keys(option).length === 0) {
        rej("Field is empty");
      }
      // let user = {};
      User.findOne(option)
        .then((user) => {
          Order.countDocuments()
            .then((count) => {
              if (count === 0) {
                res({
                  total_page: 1,
                  current_page: 1,
                  data: [],
                });
              }
              Order.find({ customer_id: user?._id })
                .skip((pageOrder - 1) * limitOrder)
                .limit(limitOrder)
                .sort({ created_at: -1 })
                .populate(
                  "products.product_id",
                  "product_quantity estimated_value"
                )
                .then((data) => {
                  const resData = { orders: data, customer: user };
                  res({
                    total_page: Math.ceil(count / limitOrder),
                    current_page: +pageOrder,
                    data: resData,
                    data_length: count,
                    limit: limitOrder,
                  });
                })
                .catch((err) => rej(err));
              // User.findOne(option).then((user) => {
              //   if (!user) {
              //     rej("Customer is not found");
              //   }
              //   Order.find({ customer_id: user._id })
              //     .populate({
              //       path: "products.product_id",
              //       select: "product_name estimated_value",
              //     })
              //     .select("-customer_id")
              //     .then((data) => {
              //       if (!data) {
              //         rej("Order is not found");
              //       }
              //       res({ orders: data, customer: user });
              //     })
              //     .catch((err) => rej(err));
            })
            .catch((err) => rej(err));
        })
        .catch((err) => rej(err));
    });
  };

  static getListOrder = (query) => {
    return new Promise((res, rej) => {
      const { page, limit } = query;
      const pageOrder = page || DATA_PAGE;
      const limitOrder = limit || LIMIT_DATA_PAGE;
      Order.countDocuments().then((count) => {
        if (count === 0) {
          res({
            total_page: 1,
            current_page: 1,
            data: [],
          });
        }
        Order.find()
          .skip((pageOrder - 1) * limitOrder)
          .limit(limitOrder)
          .sort({ created_at: -1 })
          .populate("customer_id")
          .populate("products.product_id", "product_quantity estimated_value")
          .then((data) =>
            res({
              total_page: Math.ceil(count / limitOrder),
              current_page: +pageOrder,
              data,
              data_length: count,
              limit: limitOrder,
            })
          )
          .catch((err) => rej(err));
      });
    });
  };

  static getDetailOrderById = (id) => {
    return new Promise((res, rej) => {
      Order.findById(id)
        .populate({
          path: "products.product_id",
          select:
            "product_name estimated_value interest_rate product_quantity pawn_date term",
        })
        .populate({
          path: "customer_id",
          select: "name phone_number address identity_card",
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

  static updateOrderField = (body, id) => {
    return new Promise((res, rej) => {
      Order.findById(id)
        .then((data) => {
          if (!data) {
            rej("Order not found");
          }
          const { interest_rate, customer_id, staff_id } = body;
          interest_rate ? (data.interest_rate = interest_rate) : "";
          UserService.findUserByField({ field: customer_id })
            .then((user) => {
              if (!user) {
                rej("Identify card is wrong");
              }
              data.customer_id = user._id;
              staff_id ? (data.staff_id = staff_id) : "";
              data.updated_at = new Date().getTime();
              data
                .save()
                .then((result) => res(result))
                .catch((err) => rej(err));
            })
            .catch((err) => rej(err));
        })
        .catch((err) => rej(err));
    });
  };

  static getOrderFilePDF = (id) => {
    return new Promise((res, rej) => {
      this.getDetailOrderById(id).then((data) => {
        generatePDF(data).then((result) => {
          if (!result) {
            rej("Generate PDF file error");
          }
          res(result.fileName);
        });
      });
    });
  };
}

module.exports = OrderService;
