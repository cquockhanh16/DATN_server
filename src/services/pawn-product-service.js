const mongoose = require("mongoose");
const pawnProuct = require("../models/pawn-product-model");
const User = require("../models/user-model");
const UserService = require("./user-service");
const { cloudinary } = require("../configs/upload-config");
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");
const { getMonthsBetweenDates } = require("../utils/time-function");
const { createTransaction } = require("./transaction-service");

require("dotenv").config();

class PawnProductService {
  static createPawnProduct = (body, file = null) => {
    return new Promise((res, rej) => {
      const {
        product_name,
        product_description,
        product_image,
        estimated_value,
        sale_price,
        product_condition,
        product_status,
        user_id,
        category_id,
        term,
        pawn_date,
        product_quantity,
        interest_rate,
      } = body;
      if (product_name === undefined || product_name.trim() === "") {
        rej("Field product name can't empty");
      }
      if (estimated_value === undefined || isNaN(estimated_value)) {
        rej("Field product name is empty or not number");
      }
      const newProduct = new pawnProuct();
      newProduct.product_name = product_name;
      newProduct.estimated_value = estimated_value;
      newProduct.interest_rate = interest_rate;
      product_description
        ? (newProduct.product_description = product_description)
        : "";
      product_image ? (newProduct.product_image = product_image) : "";
      sale_price ? (newProduct.sale_price = sale_price) : "";
      product_condition
        ? (newProduct.product_condition = product_condition)
        : "";
      product_quantity ? (newProduct.product_quantity = product_quantity) : "";
      product_status ? (newProduct.product_status = product_status) : "";
      let userr = null;
      UserService.findUserByField({ field: user_id })
        .then((user) => {
          if (user) {
            newProduct.user_id = user?._id;
            userr = user;
          }
          category_id ? (newProduct.category_id = category_id) : "";
          newProduct.pawn_date = pawn_date;
          newProduct.created_at = new Date().getTime();
          newProduct.term = term;
          const monthsBetweens = getMonthsBetweenDates(pawn_date, term);
          newProduct.holding_months = new Array(monthsBetweens).fill("");
          if (file && file.path) {
            newProduct.product_image = file.path;
          }

          return newProduct.save();
        })
        .then(async (data) => {
          console.log(userr);
          await createTransaction({
            customerId: userr != null ? userr?.identity_card : null,
            productId: data?._id,
            amount: estimated_value * product_quantity,
            orderId: `PAWN${new Date().getTime()}_${data?._id}_${
              userr?.identity_card
            }`,
            status: "success",
            transactionType: "pawn",
          });
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
    });
  };

  static getListPawnProductByCustomerField = (query) => {
    return new Promise((res, rej) => {
      const option = [];
      let { field, user, page, limit } = query;
      const pageOrder = page || DATA_PAGE;
      const limitOrder = limit || LIMIT_DATA_PAGE;
      console.log(user);
      field += "";
      if (typeof field === "string") {
        option.push(
          { name: { $regex: field, $options: "i" } },
          { phone_number: { $regex: field, $options: "i" } },
          { address: { $regex: field, $options: "i" } },
          { identity_card: { $regex: field, $options: "i" } }
        );
      }
      try {
        const objectId = new mongoose.Types.ObjectId(field);
        option.push({ _id: objectId });
      } catch (error) {}
      User.findOne({ $or: option }).then((user) => {
        if (!user) {
          rej("Customer is not found");
        }
        pawnProuct.countDocuments().then((count) => {
          if (count === 0) {
            res({
              total_page: 1,
              current_page: 1,
              data: [],
              limit: +limitOrder,
              data_length: count,
            });
          }
          pawnProuct
            .find({ user_id: user?._id })
            .skip((pageOrder - 1) * limitOrder)
            .limit(limitOrder)
            .populate("category_id")
            .select("-user_id")
            .then((data) => {
              if (!data) {
                rej("Pawn product is not found");
              }
              const resData = { pawn_products: data, customer: user };
              res({
                total_page: Math.ceil(data.length / limitOrder),
                current_page: +pageOrder,
                data: resData,
                data_length: count,
                limit: +limitOrder,
              });
            })
            .catch((err) => rej(err));
        });
      });
    });
  };

  static getListPawnProduct = (query) => {
    return new Promise((res, rej) => {
      const { page, limit } = query;
      const pageOrder = page || DATA_PAGE;
      const limitOrder = limit || LIMIT_DATA_PAGE;
      pawnProuct.countDocuments().then((count) => {
        if (count === 0) {
          res({
            total_page: 1,
            current_page: 1,
            data: [],
          });
        }
        pawnProuct
          .find()
          .sort({ created_at: -1 })
          .skip((pageOrder - 1) * limitOrder)
          .limit(limitOrder)
          .populate("user_id")
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

  static getProductClient = (query) => {
    return new Promise((res, rej) => {
      const { page, limit } = query;
      const pageOrder = page || DATA_PAGE;
      const limitOrder = limit || LIMIT_DATA_PAGE;
      pawnProuct.countDocuments().then((count) => {
        if (count === 0) {
          res({
            total_page: 1,
            current_page: 1,
            data: [],
          });
        }
        pawnProuct
          .find()
          .sort({ created_at: -1 })
          .skip((pageOrder - 1) * limitOrder)
          .limit(limitOrder)
          .populate("user_id")
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

  static getDetailPawnProductById = (id) => {
    return new Promise((res, rej) => {
      pawnProuct
        .findById(id)
        .populate("category_id")
        .populate("user_id")
        .then((data) => {
          if (!data) {
            rej("Pawn product not found");
          }
          res(data);
        })
        .catch((err) => rej(err));
    });
  };

  static updatePawnProduct = (body, file = null, id, isPayment = false) => {
    return new Promise((res, rej) => {
      const {
        product_name,
        product_description,
        product_image,
        estimated_value,
        sale_price,
        product_condition,
        product_status,
        user_id,
        category_id,
        holding_months,
        product_quantity,
        interest_rate,
      } = body;
      pawnProuct
        .findById(id)
        .populate("user_id")
        .then(async (data) => {
          if (!data) {
            rej("Pawn product not found");
          }
          product_name && product_name.trim() !== ""
            ? (data.product_name = product_name)
            : "";
          interest_rate && interest_rate.trim() !== ""
            ? (data.interest_rate = interest_rate)
            : "";
          product_description && product_description.trim() !== ""
            ? (data.product_description = product_description)
            : "";
          product_image && product_image.trim() !== ""
            ? (data.product_image = product_image)
            : "";
          estimated_value && !isNaN(estimated_value)
            ? (data.estimated_value = estimated_value)
            : "";

          product_quantity && !isNaN(product_quantity)
            ? (data.product_quantity = product_quantity)
            : "";
          product_condition && product_condition.trim() !== ""
            ? (data.product_condition = product_condition)
            : "";
          product_status && product_status.trim() !== ""
            ? (data.product_status = product_status)
            : "";
          user_id && user_id.trim() !== "" ? (data.user_id = user_id) : "";
          category_id && category_id.trim() !== ""
            ? (data.category_id = category_id)
            : "";
          if (+sale_price > 0 && !isNaN(sale_price)) {
            data.sale_price = sale_price;
            data.product_status = "liquidated";
            await createTransaction({
              productId: id,
              amount: sale_price * data.product_quantity,
              customerId: data.user_id.identity_card,
              orderId: `LIQUIDATED${new Date().getTime()}_${id}_${
                data.user_id.identity_card
              }`,
              status: "success",
              transactionType: "liquidation",
            });
          }
          if (product_status === "redeemed") {
            data.product_status = "redeemed";
            await createTransaction({
              productId: id,
              amount: data.estimated_value * data.product_quantity,
              customerId: data.user_id.identity_card,
              orderId: `REDEEMED${new Date().getTime()}_${id}_${
                data.user_id.identity_card
              }`,
              status: "success",
              transactionType: "redeem",
            });
          }
          if (holding_months && holding_months.length > 0) {
            const months =
              holding_months.length > 1
                ? holding_months.split(",")
                : [holding_months];
            let count = months.length || 0;
            data.holding_months = data.holding_months.map((item, index) => {
              if (item === "" && count > 0) {
                count--;
                return new Date().getTime();
              }
              return item;
            });
            if (!isPayment) {
              await createTransaction({
                productId: id,
                amount:
                  data.estimated_value *
                  (data.interest_rate / 100) *
                  holding_months.length *
                  data.product_quantity,
                customerId: data.user_id.identity_card,
                orderId: `INTEREST${new Date().getTime()}_${id}_${
                  data.user_id.identity_card
                }`,
                status: "success",
                transactionType: "interest_payment",
              });
            }
          }
          if (file && file.path) {
            const publib_id = `${process.env.CLOUD_FOLDER_NAME}/${
              data.product_image.split("/").pop().split(".")[0]
            }`;
            cloudinary.uploader.destroy(publib_id).then((reslt) => {
              console.log(publib_id);
              data.product_image = file.path;
              return data.save();
            });
          } else {
            return data.save();
          }
        })
        .then((result) => res(result))
        .catch((err) => rej(err));
    });
  };
}

module.exports = PawnProductService;
