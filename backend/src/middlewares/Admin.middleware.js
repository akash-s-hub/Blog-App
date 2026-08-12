const isAdmin = (user) => {
  if (user.role === "admin") return true;
  return false;
}

module.exports = { isAdmin };