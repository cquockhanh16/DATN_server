const AccountService = require("../services/account-service");

class AccountController {
  static lockAccount = async (req, res, next) => {
    try {
      const body = req.body;
      const auth = await AccountService.lockAccount(body);
      res.status(201).json({
        sts: true,
        data: {},
        err: null,
        mes: "Lock account successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListAccount = async (req, res, next) => {
    try {
      const { page, limit } = req.params;
      const listAccount = await AccountService.getListAccount(page, limit);
      res.status(200).json({
        sts: true,
        err: null,
        data: listAccount,
        msg: "Get list account success",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AccountController;
