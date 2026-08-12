const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/Auth.route");
const postRouter = require("./routes/Post.route");
const commentRouter = require("./routes/Comment.route");
const likeRouter = require("./routes/Like.route");
const categoryRouter = require("./routes/Category.route");
const searchRouter = require("./routes/Search.route");
const { errorHandler, notFound } = require("./middlewares/ErrorHandler.middleware");
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet");
const cors = require("cors");

const app = express();

app.use(express.json())
// app.use(mongoSanitize())
app.use(cookieParser());

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // required since you're using httpOnly cookies
}));

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/posts/:postId/comments", commentRouter);
app.use("/api/posts/:postId/like", likeRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/search", searchRouter);

app.use(notFound);
app.use(errorHandler)

module.exports = app;