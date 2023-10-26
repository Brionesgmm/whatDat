const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");

router.post("/addcategory", categoryController.addCategory);
router.get("/", categoryController.getCategories);

module.exports = router;
