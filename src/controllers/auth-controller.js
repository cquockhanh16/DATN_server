const AccountService = require("../services/account-service");

class AuthController {
  static login = async (req, res, next) => {
    try {
      const body = req.body;
      const auth = await AccountService.login(body);
      res.status(201).json({
        sts: true,
        data: auth.data,
        token: auth.token,
        err: null,
        mes: "Login successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
