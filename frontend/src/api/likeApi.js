import api from "./axios";

export const toggleLike = (postId) => api.post(`/posts/${postId}/like`);
export const getLikeStatus = (postId) => api.get(`/posts/${postId}/like/status`);