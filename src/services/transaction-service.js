const Transaction = require("../models/transaction-model");
const User = require("../models/user-model");
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");

class TransactionService {
  static getListTransaction = (query) => {
    return new Promise((res, rej) => {
      const { page, limit, customerId } = query;
      let option = {};
      customerId ? (option.customerId = customerId) : "";
      const pageOrder = +page || DATA_PAGE;
      const limitOrder = +limit || LIMIT_DATA_PAGE;
      Transaction.countDocuments(option).then((count) => {
        if (count === 0) {
          res({
            total_page: 1,
            current_page: 1,
            data: [],
            limit: +limitOrder,
            data_length: count,
          });
        }
        Transaction.find(option)
          .skip((+pageOrder - 1) * +limitOrder)
          .limit(+limitOrder)
          .then((data) => {
            if (!data) {
              rej("Transaction is not found");
            }
            res({
              total_page: Math.ceil(data.length / limitOrder),
              current_page: +pageOrder,
              data: data,
              data_length: count,
              limit: +limitOrder,
            });
          })
          .catch((err) => rej(err));
      });
    });
  };
}

module.exports = TransactionService;
