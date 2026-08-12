const { Router } = require("express");
const { registerUser, loginUser, getMe, updateMe, updatePassword, logoutUser, refreshAccessToken } = require("../controllers/Auth.controller");
const protect = require("../middlewares/Auth.middleware");
const upload = require("../middlewares/Multer.middleware");
const rateLimit = require("express-rate-limit");

const authRouter = Router();

// Strict limiter - for auth routes specifically
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                   // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later." }
});

authRouter.post("/register", authLimiter, upload.single("avatar"), registerUser);
authRouter.post("/login", authLimiter, loginUser);
authRouter.get("/me", protect, getMe);
authRouter.put("/me", protect, upload.single("avatar"), updateMe);
authRouter.put("/me/password", protect, updatePassword);
authRouter.post("/logout", logoutUser)
authRouter.post("/refresh", authLimiter, refreshAccessToken)

module.exports = authRouter;