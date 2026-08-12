const Post = require("../models/Post.model");
const asyncHandler = require("../middlewares/AsyncHandler.middleware");

const search = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || typeof q !== "string" || !q.trim()) {
    res.status(400);
    throw new Error("Search query 'q' is required");
  }

  const posts = await Post.find(
    { $text: { $search: q } },
    { score: { $meta: "textScore" } } // grab relevance score
  )
    .sort({ score: { $meta: "textScore" } }) // most relevant first
    .select("title slug content author category createdAt")
    .populate("author", "username avatar")
    .limit(20);

  return res.status(200).json({
    success: true,
    message: "search result fetched successfully",
    posts
  });
});

module.exports = { search };