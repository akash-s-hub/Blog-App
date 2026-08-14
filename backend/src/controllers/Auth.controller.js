const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/AsyncHandler.middleware");
const User = require("../models/User.model");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/Cloudinary.service");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const { setAuthCookies, clearAuthCookies } = require("../utils/cookieOptions");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, bio } = req.body;

  if (!username || !email || !password ||
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400);
    throw new Error("Please provide all required field");
  }

  const [usernameTaken, emailTaken] = await Promise.all([
    User.findOne({ username }),
    User.findOne({ email })
  ]);

  if (usernameTaken || emailTaken) {
    res.status(400);
    const errors = [];
    if (usernameTaken) errors.push("Username already exists");
    if (emailTaken) errors.push("Email already exists");
    throw new Error(errors.join(", "));
  }

  let result;
  if (req.file) {
    result = await uploadToCloudinary(req.file, "avatars");
  }

  const newUser = await User.create({
    username, email, password, bio, avatarUrl: result?.secure_url, avatarPublicId: result?.public_id
  })

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  newUser.refreshToken = refreshToken;

  await newUser.save({ validateBeforeSave: false })

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(201).json({
    success: true,
    message: "user registered successfully",
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      bio: newUser.bio,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl,
      avatarPublicId: newUser.avatarPublicId
    }
  })
})

const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const incomingRefreshToken = req.cookies.refreshToken;

  if (incomingRefreshToken) {
    res.status(409)
    throw new Error("you're logged in already");
  }

  if (!identifier || !password || typeof identifier !== "string" || typeof password !== "string") {
    res.status(400);
    throw new Error("Please provide values in all fields");
  }

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }]
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken(user._id)

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(200).json({
    success: true,
    message: "user logged in successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      role: user.role,
      avatarUrl: user.avatarUrl,
      avatarPublicId: user.avatarPublicId
    }
  })
})

const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "user fetched successfully",
    user: req.user
  })
})

const updateMe = asyncHandler(async (req, res) => {
  const { username, email, bio } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const [usernameTaken, emailTaken] = await Promise.all([
    username ? User.findOne({ username, _id: { $ne: user._id } }) : null,
    email ? User.findOne({ email, _id: { $ne: user._id } }) : null
  ]);

  if (usernameTaken || emailTaken) {
    res.status(400);
    const errors = [];
    if (usernameTaken) errors.push("Username already taken");
    if (emailTaken) errors.push("Email already taken");
    throw new Error(errors.join(", "));
  }

  if (username) user.username = username;
  if (email) user.email = email;
  if (bio !== undefined) user.bio = bio;

  if (req.file) {
    const result = await uploadToCloudinary(req.file, "avatars");

    const oldPublicId = user.avatarPublicId;

    user.avatarUrl = result.secure_url;
    user.avatarPublicId = result.public_id;

    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }
  }

  await user.save()

  return res.status(200).json({
    success: true,
    message: "profile updated successfully",
    user: user
  })
})

const updatePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    res.status(400);
    throw new Error("please provide all fields");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  user.password = newPassword;

  await user.save();

  setAuthCookies(res, newAccessToken, newRefreshToken);

  return res.status(200).json({
    success: true,
    message: "password changed successfully"
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    res.status(409)
    throw new Error("you're logged out already")
  }

  await User.findOneAndUpdate(
    { refreshToken: incomingRefreshToken },
    { refreshToken: null }
  );

  clearAuthCookies(res);

  return res.status(200).json({ success: true, message: "Logged out successfully" });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    res.status(401);
    throw new Error("no refresh token - please login again");
  }

  const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.userid).select("+refreshToken");

  if (!user || (user.refreshToken !== incomingRefreshToken)) {
    res.status(401);
    throw new Error("invalid refresh token - please login again");
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, newAccessToken, newRefreshToken);
  return res.status(200).json({
    success: true,
    message: "token refreshed successfully"
  })

})

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  updatePassword,
  logoutUser,
  refreshAccessToken
};