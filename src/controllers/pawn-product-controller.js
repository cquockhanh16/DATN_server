const PawnProductService = require("../services/pawn-product-service");
const CategoryService = require("../services/category-service");
const UserService = require("../services/user-service");

class PawnProductController {
  static createPawnProduct = async (req, res, next) => {
    try {
      const { body, file } = req;
      const newProduct = await PawnProductService.createPawnProduct(body, file);
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
      const { field, limit, page } = req.query;
      const user = req.user;
      const list = await PawnProductService.getListPawnProductByCustomerField({
        field,
        user,
        limit,
        page,
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
      const { body, file } = req;
      const { id } = req.params;
      const updatedProduct = await PawnProductService.updatePawnProduct(
        body,
        file,
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
