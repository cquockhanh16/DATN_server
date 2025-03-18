const CategoryService = require("../services/category-service");

class CategoryController {
  static createCategory = async (req, res, next) => {
    try {
      const { category_name } = req.body;
      const newCategory = await CategoryService.createCategory(category_name);
      res.status(201).json({
        sts: true,
        data: newCategory,
        err: null,
        mes: "create category successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
  static getListCategory = async (req, res, next) => {
    try {
      const categoryList = await CategoryService.getListCategory();
      res.status(200).json({
        sts: true,
        data: categoryList,
        err: null,
        mes: "get list category successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CategoryController;
