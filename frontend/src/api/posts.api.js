import api from "./axios";

// cursor/limit accepted now so switching on pagination later is a one-line change in Home.jsx,
// not a rewrite of this file
export const getPosts = async (params = {}) => {
  const res = await api.get("/posts", { params });
  return res.data;
};

export const getPostBySlug = async (slug) => {
  const res = await api.get(`/posts/${slug}`);
  return res.data;
};

export const createPost = async (data) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const updatePost = async (id, data) => {
  const res = await api.put(`/posts/${id}`, data);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const getPostsByUser = async (userId) => {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
};