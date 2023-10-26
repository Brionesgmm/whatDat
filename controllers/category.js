const Category = require("../models/Category");

exports.addCategory = async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.categoryName,
      words: req.body.words,
    });

    console.log("Category has been added!");
    res.json({ category });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
