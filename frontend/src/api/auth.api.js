import api from "./axios";

export const registerUser = async ({ username, email, password, avatar, bio }) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  if (bio) formData.append("bio", bio);
  if (avatar) formData.append("avatar", avatar);

  const res = await api.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data)
  return res.data;
}

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
}

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/auth/me", data)
  return res.data;
}

export const changePassword = async (data) => {
  const res = await api.put("/auth/me/password", data)
  return res.data;
}
