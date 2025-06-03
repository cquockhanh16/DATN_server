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
        Transaction.find({ ...option, transactionType: { $ne: "liquidation" } })
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

  static getListTransactionAdmin = (query) => {
    return new Promise((res, rej) => {
      const { page, limit } = query;
      let option = {};
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
        Transaction.find({ ...option })
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

  static createTransaction = async (body) => {
    const {
      customerId,
      productId,
      amount,
      paymentMethod,
      transactionCode,
      payType,
      orderId,
      status,
      transactionType,
    } = body;
    const trans = new Transaction();
    trans.customerId = customerId;
    trans.productId = productId;
    trans.amount = amount;
    paymentMethod ? (trans.paymentMethod = paymentMethod) : "";
    transactionCode ? (trans.transactionCode = transactionCode) : "";
    transactionType ? (trans.transactionType = transactionType) : "";
    payType ? (trans.payType = payType) : "";
    orderId ? (trans.orderId = orderId) : "";
    status ? (trans.status = status) : "pending";
    await trans.save();
  };

  static transactionStatistics = (query) => {
    return new Promise((res, rej) => {
      const { startDate, endDate } = query;

      Transaction.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(+startDate),
              $lte: new Date(+endDate),
            },
            transactionType: {
              $in: ["pawn", "interest_payment", "redeem", "liquidation"],
            },
            amount: { $exists: true },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" }, // Trích xuất năm từ timestamp
              month: { $month: "$createdAt" }, // Trích xuất tháng (1-12)
              type: "$transactionType", // Giữ lại loại giao dịch
            },
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            type: "$_id.type",
            totalAmount: 1,
            count: 1,
            monthYear: {
              // Tạo chuỗi "Tháng X/YYYY" để hiển thị
              $concat: [
                "Tháng ",
                { $toString: "$_id.month" },
                "/",
                { $toString: "$_id.year" },
              ],
            },
          },
        },
        {
          $sort: { year: 1, month: 1 }, // Sắp xếp theo thời gian tăng dần
        },
      ])
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };
}

module.exports = TransactionService;
