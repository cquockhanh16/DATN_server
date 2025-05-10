const AccountService = require("../services/account-service");

class AuthController {
  static login = async (req, res, next) => {
    try {
      const body = req.body;
      const auth = await AccountService.login(body);
      res.status(200).json({
        sts: true,
        data: {
          account: auth.account,
          user: auth.user,
        },
        token: auth.token,
        err: null,
        mes: "Login successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  static logout = async (req, res, next) => {
    try {
      const { username } = req.body;
      const auth = await AccountService.logout(username);
      res.status(200).json({
        sts: true,
        data: auth,
        err: null,
        mes: "Logout successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  static changePassword = async (req, res, next) => {
    try {
      const body = req.body;
      const data = await AccountService.changePassword(body);
      res.status(200).json({
        sts: true,
        data: data,
        err: null,
        mes: "Change password successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
