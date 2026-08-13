const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none"
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

module.exports = setAuthCookies;