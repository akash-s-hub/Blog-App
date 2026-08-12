const { Router } = require("express");
const { getComments, addComment, deleteComment } = require("../controllers/Comment.controller");
const protect = require("../middlewares/Auth.middleware")

const commentRouter = Router({ mergeParams: true });

commentRouter.get("/", getComments);
commentRouter.post("/", protect, addComment);
commentRouter.delete("/:commentId", protect, deleteComment);

module.exports = commentRouter;