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
        console.log(categortExist);
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
}

module.exports = PawnProductController;
