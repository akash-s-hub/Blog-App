const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/AsyncHandler.middleware");
const Post = require("../models/Post.model");
const Like = require("../models/Like.model");

const likePost = asyncHandler(async (req, res) => {
  const user = req.user;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("post id not found");
  }

  const postExists = await Post.exists({ _id: postId });
  if (!postExists) {
    res.status(404);
    throw new Error("post not found");
  }

  const like = await Like.findOne({ post: postId, user: user._id })

  if (like) {
    await like.deleteOne();
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

    return res.status(200).json({
      success: true,
      message: "post unliked"
    });
  } else {
    await Like.create({ post: postId, user: user._id });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    return res.status(200).json({
      success: true,
      message: "post liked successfully"
    })
  }
})

const checkStatus = asyncHandler(async (req, res) => {
  const user = req.user;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("invalid post id");
  }

  const postExists = await Post.exists({ _id: postId });
  if (!postExists) {
    res.status(404);
    throw new Error("post not found");
  }

  const like = await Like.findOne({
    post: postId,
    user: user._id
  })

  if (like) {
    return res.status(200).json({
      success: true,
      message: "you have liked the post",
      liked: true
    })
  } else {
    return res.status(200).json({
      success: true,
      message: "you havent liked the post yet",
      liked: false
    })
  }
})

module.exports = {
  likePost,
  checkStatus
}