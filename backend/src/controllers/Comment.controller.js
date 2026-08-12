const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/AsyncHandler.middleware");
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");
const { isAdmin } = require("../middlewares/Admin.middleware");

const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("invalid post id");
  }

  const [post, comments] = await Promise.all([
    Post.findById(postId),
    Comment.find({ post: postId })
      .populate("author", "username avatar") // adjust fields to your User schema
      .populate("post", "title")        // adjust fields to your Post schema
  ]);

  if (!post) {
    res.status(404);
    throw new Error("post not found");
  }

  return res.status(200).json({
    success: true,
    message: "comments fetched successfully",
    comments
  })
})

const addComment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { postId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("invalid post id")
  }

  if (!content || typeof content !== "string") {
    res.status(400);
    throw new Error("comment content is required");
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    res.status(400);
    throw new Error("no comment to write")
  }

  if (trimmedContent.length > 500) {
    res.status(400);
    throw new Error("comment exceeded limit of 500 letters");
  }

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("no post found");
  }

  const comment = await Comment.create({
    post: postId, author: user._id, content: trimmedContent
  });

  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } })

  const populatedComment = await comment.populate([
    { path: "author", select: "username avatar" },
    { path: "post", select: "title" }
  ]);

  return res.status(201).json({
    success: true,
    message: "comment added succesfully",
    comment: populatedComment
  })
})

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId, postId } = req.params;
  const user = req.user;

  if (
    !mongoose.Types.ObjectId.isValid(commentId) ||
    !mongoose.Types.ObjectId.isValid(postId)
  ) {
    res.status(400);
    throw new Error("invalid post or comment id")
  }

  const [comment, post] = await Promise.all([
    Comment.findById(commentId),
    Post.findById(postId)
  ]);

  if (!comment || !post) {
    res.status(404);
    throw new Error("comment or post not found");
  }

  if (!comment.post.equals(postId)) {
    res.status(400);
    throw new Error("comment does not belong to this post");
  }

  if (comment.author.equals(user._id) ||
    post.author.equals(user._id) ||
    isAdmin(user)
  ) {
    await comment.deleteOne();
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } })


    return res.status(200).json({
      success: true,
      message: "comment deleted successfully"
    })
  }

  return res.status(403);
  throw new Error("forbidden");
})

module.exports = {
  getComments,
  addComment,
  deleteComment
}