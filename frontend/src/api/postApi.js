import api from "./axios";

export const getPosts = () => api.get("/posts");
export const getPostBySlug = (slug) => api.get(`/posts/${slug}`);
export const createPost = (data) => api.post("/posts", data);
export const updatePost = (postId, data) => api.put(`/posts/${postId}`, data);
export const deletePost = (postId) => api.delete(`/posts/${postId}`);
export const getPostsByUser = (userId) => api.get(`/posts/user/${userId}`);