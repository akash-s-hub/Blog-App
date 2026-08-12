const { Router } = require("express");
const { search } = require("../controllers/Search.controller");

const searchRouter = Router();

searchRouter.get("/", search);

module.exports = searchRouter;