const { Router } = require("express");
const { registerUser, loginUser, getMe, updateMe, updatePassword, logoutUser, refreshAccessToken } = require("../controllers/Auth.controller");
const protect = require("../middlewares/Auth.middleware");
const upload = require("../middlewares/Multer.middleware");
const rateLimit = require("express-rate-limit");

const authRouter = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20, // 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later" },
});

authRouter.post("/register", authLimiter, upload.single("avatar"), registerUser);
authRouter.post("/login", authLimiter, loginUser);
authRouter.get("/me", protect, getMe);
authRouter.put("/me", protect, upload.single("avatar"), updateMe);
authRouter.put("/me/password", protect, updatePassword);
authRouter.post("/logout", logoutUser)
authRouter.post("/refresh", authLimiter, refreshAccessToken)

module.exports = authRouter;