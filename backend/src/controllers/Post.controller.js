const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/AsyncHandler.middleware");
const Post = require("../models/Post.model");
const Category = require("../models/Category.model");
const { isAdmin } = require("../middlewares/Admin.middleware");

// Normalizes tags whether they arrive as:
// - a comma-separated string:      "js,node,mongo"
// - an array of strings (multer):  ["js", "node", "mongo"]
const parseTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags
      .map((t) => (typeof t === "string" ? t.trim() : t))
      .filter((t) => typeof t === "string" && t.length > 0);
  }
  if (typeof tags === "string") {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
};

const getAllPosts = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50); // cap it, don't trust client
  const cursor = req.query.cursor; // last post's _id from previous page, or undefined for page 1

  const filter = { status: "published" };
  if (cursor) {
    filter._id = { $lt: cursor }; // "give me posts created before this one"
  }

  const posts = await Post.find(filter)
    .sort({ _id: -1 })       // newest first
    .limit(limit + 1)        // fetch one extra to know if there's more
    .populate("author", "username avatarUrl")
    .populate("category", "name slug");

  const hasMore = posts.length > limit;
  const results = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? results[results.length - 1]._id : null;

  res.status(200).json({
    success: true,
    message: "posts fetched successfully",
    posts: results,
    nextCursor,
    hasMore,
  });
});

const getPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(404);
    throw new Error("no slug found");
  }

  const post = await Post.findOne({ slug })
    .populate("author", "username avatarUrl").populate("category", "name slug");;

  if (!post) {
    res.status(404);
    throw new Error("no post found");
  }

  return res.status(200).json({
    success: true,
    message: "post fetched successfully",
    post,
  });
});

const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags, category } = req.body;
  const author = req.user?._id;

  if (!author) {
    res.status(401);
    throw new Error("unauthorized");
  }

  const trimmedTitle = typeof title === "string" ? title.trim() : title;
  const trimmedContent = typeof content === "string" ? content.trim() : content;
  const parsedTags = parseTags(tags);
  const postCategory = await Category.findOne({ name: category });

  if (
    !trimmedTitle ||
    !trimmedContent ||
    !postCategory ||
    typeof title !== "string" ||
    typeof content !== "string" ||
    parsedTags.length === 0
  ) {
    res.status(400);
    throw new Error("provide all fields");
  }

  if (parsedTags.length > 5) {
    res.status(400);
    throw new Error("maximum 5 tags allowed");
  }

  const post = await Post.create({
    title: trimmedTitle,
    content: trimmedContent,
    tags: parsedTags,
    category: postCategory,
    author
  });

  return res.status(201).json({
    success: true,
    message: "post created successfully",
    post,
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content, tags, category } = req.body;
  const { postId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("invalid post id");
  }

  if (!title && !content && !tags && !category) {
    res.status(400);
    throw new Error("provide at least one field");
  }

  const postCategory = await Category.findOne({ name: category });

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("no post found");
  }

  if (!post.author.equals(user._id)) {
    res.status(403);
    throw new Error("post doesnt belong to the user");
  }

  if (title) {
    if (typeof title !== "string" || !title.trim()) {
      res.status(400);
      throw new Error("invalid title");
    }
    post.title = title.trim();
  }

  if (content) {
    if (typeof content !== "string" || !content.trim()) {
      res.status(400);
      throw new Error("invalid content");
    }
    post.content = content.trim();
  }

  if (tags) {
    const parsedTags = parseTags(tags);

    if (parsedTags.length === 0) {
      res.status(400);
      throw new Error("provide valid tags");
    }

    if (parsedTags.length > 5) {
      res.status(400);
      throw new Error("maximum 5 tags allowed");
    }

    post.tags = parsedTags;
  }

  if (postCategory) {
    post.category = postCategory;
  }

  await post.save();

  return res.status(200).json({
    success: true,
    message: "post updated successfully",
    post,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("invalid post id");
  }

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("no post found");
  }

  if (!isAdmin(user) && !post.author.equals(user._id)) {
    res.status(403);
    throw new Error("post doesnt belong to the user");
  }

  await post.deleteOne();

  return res.status(200).json({
    success: true,
    message: "post deleted successfully",
  });
});

const getAllPostsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("invalid user id");
  }

  const posts = await Post.find({ author: userId });

  return res.status(200).json({
    success: true,
    message: "posts from the given user fetched successfully",
    posts,
  });
});

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getAllPostsByUser,
};