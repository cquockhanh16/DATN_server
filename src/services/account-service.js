const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Account = require("../models/account-model");
const User = require("../models/user-model");
const {
  DATA_PAGE,
  LIMIT_DATA_PAGE,
  SALT_ROUNDS,
} = require("../configs/const-config");
require("dotenv").config();

class AccountService {
  static register = (body) => {
    return new Promise((res, rej) => {
      const { username, password } = body;
      if (!username || !password) {
        rej("Field not empty");
      }
      const newAcc = new Account();
      newAcc.username = username;
      bcrypt
        .hash(password, SALT_ROUNDS)
        .then((hashed) => {
          newAcc.password = hashed;
          newAcc.created_at = new Date().getTime();
          return newAcc.save();
        })
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };

  static login = (body) => {
    return new Promise((res, rej) => {
      const { username, password } = body;
      if (!username || !password) {
        rej("Field not empty");
      }
      Promise.all([
        Account.findOne({ username }),
        User.findOne({ identity_card: username }),
      ])
        .then((data) => {
          if (!data[0] || !data[1]) {
            rej("Account of user not found");
          }
          let acc = data[0];
          bcrypt
            .compare(password, acc.password)
            .then((isMatch) => {
              if (!isMatch) {
                acc.failed_login_attempts += 1;
                return acc.save().then((result) => rej("Password not match"));
              }
              if (acc.failed_login_attempts >= 3) {
                rej("Account was lock");
              }
              acc.failed_login_attempts = 0;
              acc.status = "on";
              return acc.save();
            })
            .then((accSave) => {
              const token = jwt.sign(
                { ...data[1], role: accSave.role || "user" },
                process.env.SECRET_KEY_JWT || "SECRET_KEY_JWT",
                {
                  expiresIn: "180 days",
                  algorithm: "HS256",
                }
              );
              res({
                data: {
                  ...accSave._doc,
                  name: data[1].name,
                  phone_number: data[1].phone_number,
                  address: data[1].address,
                  identity_card_image: data[1].identity_card_image,
                },
                token,
              });
            })
            .catch((err) => rej(err));
        })
        .catch((err) => rej(err));
    });
  };

  static lockAccount = (body) => {
    return new Promise((res, rej) => {
      const { username, status } = body;
      if (!username) {
        rej("Field not empty");
      }
      Account.findOne({ username })
        .then((acc) => {
          if (!acc) {
            rej("Account not found");
          }
          if (status && status === "lock") {
            acc.status = "off";
            acc.opentime = new Date().getTime();
          } else {
            acc.status = "lock";
            acc.locktime = new Date().getTime();
          }
          return acc.save();
        })
        .then((result) => res(result))
        .catch((err) => rej(err));
    });
  };

  static getListAccount = (page, limit) => {
    return new Promise((res, rej) => {
      const pageOrder = page || DATA_PAGE;
      const limitOrder = limit || LIMIT_DATA_PAGE;
      Account.find()
        .skip((pageOrder - 1) * limitOrder)
        .limit(limitOrder)
        .then((data) => {
          if (data.length === 0) {
            res({
              total_page: 1,
              current_page: 1,
              data: [],
            });
          }
          res({
            total_page: Math.ceil(data.length / limitOrder),
            current_page: +pageOrder,
            data,
            data_length: data.length,
            limit: limitOrder,
          });
        })
        .catch((err) => rej(err));
    });
  };
}

module.exports = AccountService;
