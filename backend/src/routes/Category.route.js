const { Router } = require("express");
const protect = require("../middlewares/Auth.middleware");
const { listAllCategories, createCategory } = require("../controllers/Category.controller");

const categoryRouter = Router();

categoryRouter.get("/", listAllCategories);
categoryRouter.post("/", protect, createCategory);

module.exports = categoryRouter;