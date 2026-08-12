const { Router } = require("express");
const protect = require("../middlewares/Auth.middleware");
const { getAllPosts, getPost, createPost, updatePost, deletePost, getAllPostsByUser } = require("../controllers/Post.controller");
const upload = require("../middlewares/Multer.middleware");

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:slug", getPost);
postRouter.post("/", protect, createPost);
postRouter.put("/:postId", protect, updatePost);
postRouter.delete("/:postId", protect, deletePost);
postRouter.get("/user/:userId", getAllPostsByUser);

module.exports = postRouter;