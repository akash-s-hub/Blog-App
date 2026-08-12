const asyncHandler = require("../middlewares/AsyncHandler.middleware");
const Category = require("../models/Category.model");
const { isAdmin } = require("../middlewares/Admin.middleware")

const listAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  return res.status(200).json({
    success: true,
    message: "categories fetched successfully",
    categories
  });
})

const createCategory = asyncHandler(async (req, res) => {
  const user = req.user;
  const { category } = req.body;

  if (!category || typeof category !== "string") {
    res.status(400);
    throw new Error("category content is required")
  }

  const trimmedCategory = category.trim();

  if (!trimmedCategory) {
    res.status(400);
    throw new Error("no category to write");
  }

  if (trimmedCategory.length > 20) {
    res.status(400);
    throw new Error("limit is 20 letters");
  }

  if (isAdmin(user)) {
    const newCategory = await Category.create({
      name: trimmedCategory
    })

    return res.status(200).json({
      success: true,
      message: "category created successfully",
      newCategory
    })
  } else {
    return res.status(403).json({
      success: false,
      message: "you can't create category"
    })
  }
})

module.exports = {
  listAllCategories,
  createCategory
}