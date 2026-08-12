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
const rateLimit = require("express-rate-limit");
const cors = require("cors");


const app = express();

app.set("trust proxy", 1); // add this near the top, before your rate limiters

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,                  // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});

app.use(generalLimiter);

app.use((req, res, next) => {
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const origin = req.get("origin");
    if (origin !== process.env.FRONTEND_URL) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }
  next();
});

app.use(express.json())
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});
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