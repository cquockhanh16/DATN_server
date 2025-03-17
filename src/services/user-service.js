const User = require("../models/user-model");

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
      newUser
        .save()
        .then((savedUser) => res(savedUser))
        .catch((err) => rej(err));
    });
  };
}

module.exports = UserService;
