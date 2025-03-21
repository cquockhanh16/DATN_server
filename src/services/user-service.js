const User = require("../models/user-model");
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");

class UserService {
  static createUser = (body) => {
    return new Promise((res, rej) => {
      const { name, phone_number, address, identity_card } = body;
      if (!name || !phone_number || !address || !identity_card) {
        rej("Fields can't empty!!");
      }
      const newUser = new User();
      newUser.name = name;
      newUser.phone_number = phone_number;
      newUser.address = address;
      newUser.identity_card = identity_card;
      newUser.created_at = new Date().getTime();
      newUser
        .save()
        .then((savedUser) => res(savedUser))
        .catch((err) => rej(err));
    });
  };

  static findUserByField = (query) => {
    return new Promise((res, rej) => {
      const { field } = query;
      const option = [];
      if (typeof field === "string") {
        option.push(
          { name: { $regex: field, $options: "i" } },
          { phone_number: { $regex: field, $options: "i" } },
          { address: { $regex: field, $options: "i" } },
          { _id: field }
        );
      }
      if (!isNaN(field)) {
        option.push({ identity_card: Number(field) });
      }
      User.find({
        $or: option,
      })
        .then((data) => {
          res(data);
        })
        .catch((err) => rej(err));
    });
  };

  static getListUser = (page, limit) => {
    return new Promise((res, rej) => {
      const pageOrder = page || DATA_PAGE;
      const limitOrder = limit || LIMIT_DATA_PAGE;
      User.countDocuments().then((count) => {
        if (count === 0) {
          res({
            total_page: 1,
            current_page: 1,
            data: [],
          });
        }
        User.find()
          .skip((pageOrder - 1) * limitOrder)
          .limit(limitOrder)
          .then((data) =>
            res({
              total_page: Math.ceil(count / limitOrder),
              current_page: +pageOrder,
              data,
            })
          )
          .catch((err) => rej(err));
      });
    });
  };

  static updateUserField = (body, id) => {
    return new Promise((res, rej) => {
      const { name, phone_number, address, identity_card } = body;
      if (!id) {
        rej("Id param is valid");
      }
      User.findOneAndUpdate(
        { _id: id },
        { name, phone_number, address, identity_card },
        {
          returnDocument: "after",
        }
      )
        .then((data) => {
          if (!data) rej("User not found");
          res(data);
        })
        .catch((err) => rej(err));
    });
  };
}

module.exports = UserService;
