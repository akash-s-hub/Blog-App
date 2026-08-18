import axios from "./axios";

export const toggleLike = async (postId) => {
  const res = await axios.post(`/posts/${postId}/like`);
  return res.data;
};

export const getLikeStatus = async (postId) => {
  const res = await axios.get(`/posts/${postId}/like/status`);
  return res.data;
};