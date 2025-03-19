const PawnProductService = require("../services/pawn-product-service");
const CategoryService = require("../services/category-service");
const UserService = require("../services/user-service");

class PawnProductController {
  static createPawnProduct = async (req, res, next) => {
    try {
      const { body } = req;
      console.log(body);
      if (body["user_id"] && body["category_id"]) {
        const [userExist, categortExist] = await Promise.all(
          UserService.findUserById(body["user_id"]),
          CategoryService.findCategoryById(body["category_id"])
        );
      } else if (body["user_id"]) {
        const userExist = await UserService.findUserById(body["user_id"]);
      } else if (body["category_id"]) {
        const categortExist = await CategoryService.findCategoryById(
          body["category_id"]
        );
      }
      const newProduct = await PawnProductService.createPawnProduct(body);
      res.status(201).json({
        sts: true,
        data: newProduct,
        err: null,
        mes: "create product successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListPawnProductByCustomerField = async (req, res, next) => {
    try {
      const { phone_number, identity_card } = req.query;
      const list = await PawnProductService.getListPawnProductByCustomerField({
        phone_number,
        identity_card,
      });
      res.status(200).json({
        sts: true,
        data: list,
        err: null,
        mes: "get list product successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListPawnProduct = async (req, res, next) => {
    try {
      const { query } = req;
      const pawnProducts = await PawnProductService.getListPawnProduct(query);
      res.status(200).json({
        sts: true,
        data: pawnProducts,
        err: null,
        mes: "get all product successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static getDetailPawnProductById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const detail = await PawnProductService.getDetailPawnProductById(id);
      res.status(200).json({
        sts: true,
        data: detail,
        err: null,
        mes: "get detail product success",
      });
    } catch (error) {
      next(error);
    }
  };

  static updatePawnProduct = async (req, res, next) => {
    try {
      const { body } = req;
      const { id } = req.params;
      const updatedProduct = await PawnProductService.updatePawnProduct(
        body,
        id
      );
      res.status(200).json({
        sts: true,
        data: updatedProduct,
        err: null,
        mes: "updated product success",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PawnProductController;
