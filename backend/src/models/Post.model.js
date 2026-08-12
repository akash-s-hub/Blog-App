const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [120, "max length is 120 letters"]
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  tags: [{
    type: String
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "published"
  }
}, {
  timestamps: true
})

postSchema.index(
  { title: "text", content: "text" },
  { weights: { title: 5, content: 1 } }
);

postSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug =
      slugify(
        this.title, { lower: true, strict: true }
      ) + "-" + Date.now().toString().slice(-5);
  }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;