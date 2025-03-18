const Category = require("../models/category-model");

class CategoryService {
  static createCategory = (category_name) => {
    return new Promise((res, rej) => {
      if (!category_name.trim()) {
        rej("Category name can't empty !");
      }
      const newCategory = new Category();
      newCategory.category_name = category_name;
      newCategory
        .save()
        .then((saveCategory) => res(saveCategory))
        .catch((err) => rej(err));
    });
  };

  static getListCategory = () => {
    return new Promise((res, rej) => {
      Category.find()
        .then((result) => {
          res(result);
        })
        .catch((err) => rej(err));
    });
  };

  static findCategoryById = (id) => {
    return new Promise((res, rej) => {
      if (id === undefined || id.trim() === "") {
        rej("Field id is valid");
      }
      Category.findById(id)
        .then((data) => {
          if (!data) {
            rej("Category not found");
          }
          res(data);
        })
        .catch((err) => rej(err));
    });
  };
}

module.exports = CategoryService;
