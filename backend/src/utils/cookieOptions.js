const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV == "production",
  sameSite: "lax"
}

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie(
    "accessToken",
    accessToken,
    { ...options, maxAge: 15 * 60 * 1000, path: "/" } // 15 mins
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    { ...options, maxAge: 7 * 24 * 60 * 60 * 1000, path: "/" } // 7 days
  );
}

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", { ...options, path: "/" });
  res.clearCookie("refreshToken", { ...options, path: "/" });
};

module.exports = { setAuthCookies, clearAuthCookies };