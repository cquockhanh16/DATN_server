const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category-controller");

router.post("/category/create", CategoryController.createCategory);

router.get("/category/list", CategoryController.getListCategory);

module.exports = router;
