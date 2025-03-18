const pawnProuct = require("../models/pawn-product-model");

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
}

module.exports = PawnProductService;
