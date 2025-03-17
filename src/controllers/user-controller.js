const UserService = require("../services/user-service");

class UserController {
  static register = async (req, res, next) => {
    try {
      const body = req.body;
      const user = await UserService.createUser(body);
      res.status(201).json({
        sts: true,
        data: user,
        err: null,
        mes: "Resgister successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
