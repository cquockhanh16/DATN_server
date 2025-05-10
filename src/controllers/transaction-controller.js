const TransactionService = require("../services/transaction-service");
require("dotenv").config();

class TransactionController {
  static getListTransaction = async (req, res, next) => {
    try {
      const list = await TransactionService.getListTransaction(req.query);
      res.status(200).json({
        sts: true,
        data: list,
        err: null,
        mes: "get list successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = TransactionController;
