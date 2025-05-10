const UserService = require("../services/user-service");

class UserController {
  static register = async (req, res, next) => {
    try {
      const body = req.body;
      const file = req.file;
      const user = await UserService.createUser(body, file);
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

  static findUserByField = async (req, res, next) => {
    try {
      const { query } = req;
      const usersField = await UserService.findUserByField(query);
      res.status(200).json({
        sts: true,
        data: usersField,
        err: null,
        msg: "Find user by field",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListUser = async (req, res, next) => {
    try {
      const { page, limit } = req.params;
      const listUser = await UserService.getListUser(page, limit);
      res.status(200).json({
        sts: true,
        err: null,
        data: listUser,
        msg: "Get list user success",
      });
    } catch (error) {
      next(error);
    }
  };

  static updateUserField = async (req, res, next) => {
    try {
      const { body, file } = req;
      const { id } = req.params;
      const updatedUser = await UserService.updateUserField(body, id, file);
      res.status(200).json({
        sts: true,
        err: null,
        data: updatedUser,
        msg: "update user success",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
