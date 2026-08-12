const { Router } = require("express");
const protect = require("../middlewares/Auth.middleware");
const { likePost, checkStatus } = require("../controllers/Like.controller");

const likeRouter = Router({ mergeParams: true });

likeRouter.post("/", protect, likePost);
likeRouter.get("/status", protect, checkStatus);

module.exports = likeRouter;