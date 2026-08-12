const jwt = require("jsonwebtoken");

function generateRefreshToken(userid) {
  return jwt.sign(
    { userid },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
}

function generateAccessToken(userid) {
  return jwt.sign(
    { userid },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
}

module.exports = { generateAccessToken, generateRefreshToken }