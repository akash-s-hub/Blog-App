const User = require("../models/user.model");
const asyncHandler = require("./AsyncHandler.middleware");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401)
    throw new Error("Unauthorized - no token available");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded.userid);

  if (!user) {
    res.status(401);
    throw new Error("not authorized - user no longer exists");
  }

  req.user = user;
  next();
})

module.exports = protect;