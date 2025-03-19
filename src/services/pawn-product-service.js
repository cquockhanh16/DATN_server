const pawnProuct = require("../models/pawn-product-model");
const User = require("../models/user-model");
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");

class PawnProductService {
  static createPawnProduct = (body) => {
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
      product_description
        ? (newProduct.product_description = product_description)
        : "";
      product_image ? (newProduct.product_image = product_image) : "";
      sale_price ? (newProduct.sale_price = sale_price) : "";
      product_condition
        ? (newProduct.product_condition = product_condition)
        : "";
      product_status ? (newProduct.product_status = product_status) : "";
      user_id ? (newProduct.user_id = user_id) : "";
      category_id ? (newProduct.category_id = category_id) : "";
      newProduct
        .save()
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };

  static getListPawnProductByCustomerField = (query) => {
    return new Promise((res, rej) => {
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
        pawnProuct
          .find({ customer_id: user._id })
          .populate("category_id")
          .select("-user_id")
          .then((data) => {
            if (!data) {
              rej("Pawn product is not found");
            }
            res({ pawn_products: data, customer: user });
          })
          .catch((err) => rej(err));
      });
    });
  };

  static getListPawnProduct = (query) => {
    return new Promise((res, rej) => {
      const { page, limit } = query;
      const pageOrder = page || DATA_PAGE;
      const limitOrder = limit || LIMIT_DATA_PAGE;
      pawnProuct
        .find()
        .skip((pageOrder - 1) * limitOrder)
        .limit(limitOrder)
        .then((data) => {
          pawnProuct
            .countDocuments()
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

  static updatePawnProduct = (body, id) => {
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
      } = body;
      const fieldUpdate = {};
      product_name && product_name.trim() !== ""
        ? (fieldUpdate.product_name = product_name)
        : "";
      product_description && product_description.trim() !== ""
        ? (fieldUpdate.product_description = product_description)
        : "";
      product_image && product_image.trim() !== ""
        ? (fieldUpdate.product_image = product_image)
        : "";
      estimated_value && !isNaN(estimated_value)
        ? (fieldUpdate.estimated_value = estimated_value)
        : "";
      sale_price && !isNaN(sale_price)
        ? (fieldUpdate.sale_price = sale_price)
        : "";
      product_condition && product_condition.trim() !== ""
        ? (fieldUpdate.product_condition = product_condition)
        : "";
      product_status && product_status.trim() !== ""
        ? (fieldUpdate.product_status = product_status)
        : "";
      user_id && user_id.trim() !== "" ? (fieldUpdate.user_id = user_id) : "";
      category_id && category_id.trim() !== ""
        ? (fieldUpdate.category_id = category_id)
        : "";
      pawnProuct
        .findByIdAndUpdate(id, fieldUpdate)
        .then((data) => {
          if (!data) {
            rej("Pawn product not found");
          }
          res(data);
        })
        .catch((err) => rej(err));
    });
  };
}

module.exports = PawnProductService;
