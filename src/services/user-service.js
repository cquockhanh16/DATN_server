const mongoose = require("mongoose");
const User = require("../models/user-model");
const { cloudinary } = require("../configs/upload-config");
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");
const AccountService = require("./account-service");
require("dotenv").config();
class UserService {
  static createUser = (body, file) => {
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
      if (file && file.path) {
        newUser.identity_card_image = file.path;
      }
      newUser
        .save()
        .then((savedUser) => {
          return AccountService.register({
            username: identity_card,
            password: phone_number,
          });
        })
        .then((data) => {
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
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
          { identity_card: { $regex: field, $options: "i" } }
        );
      }
      try {
        const objectId = new mongoose.Types.ObjectId(field);
        option.push({ _id: objectId });
      } catch (error) {}
      User.findOne({
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
      User.find()
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

  static updateUserField = (body, id, file) => {
    return new Promise((res, rej) => {
      const { name, phone_number, address, identity_card } = body;
      if (!id) {
        rej("Id param is valid");
      }
      User.findOne({ _id: id })
        .then((user) => {
          if (!user) {
            rej("User not found");
          }
          name ? (user.name = name) : "";
          phone_number ? (user.phone_number = phone_number) : "";
          address ? (user.address = address) : "";
          identity_card ? (user.identity_card = identity_card) : "";
          if (file && file.path) {
            const publib_id = `${process.env.CLOUD_FOLDER_NAME}/${
              user.identity_card_image.split("/").pop().split(".")[0]
            }`;
            cloudinary.uploader.destroy(publib_id).then((reslt) => {
              user.identity_card_image = file.path;
              return user.save();
            });
          } else {
            return user.save();
          }
        })
        .then((data) => {
          res(data);
        })
        .catch((err) => rej(err));
    });
  };
}

module.exports = UserService;
