import api from "./axios";

export const login = (credentials) =>
  api.post("/auth/login", credentials, {
    skipAuthRefresh: true,
    skipAuthRedirect: true,
  });

export const register = (data) =>
  api.post("/auth/register", data, {
    skipAuthRefresh: true,
    skipAuthRedirect: true,
  });

export const logout = () =>
  api.post("/auth/logout", null, {
    skipAuthRefresh: true,
    skipAuthRedirect: true,
  });

export const getMe = () =>
  api.get("/auth/me", {
    skipAuthRedirect: true,
  });

export const updateMe = (data) => api.put("/auth/me", data);
export const updatePassword = (data) => api.put("/auth/me/password", data);