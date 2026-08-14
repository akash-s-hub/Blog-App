import api from "./axios";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data)
  return res.data;
}

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
