const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
}

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie(
    "accessToken",
    accessToken,
    { ...options, maxAge: 24 * 60 * 60 * 1000 } // 1 hour
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
  );
}

module.exports = setAuthCookies;