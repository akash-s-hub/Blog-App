import axios from "./axios";

export const getComments = async (postId) => {
  const res = await axios.get(`/posts/${postId}/comments`);
  return res.data;
};

export const addComment = async (postId, content) => {
  const res = await axios.post(`/posts/${postId}/comments`, { content });
  return res.data;
};

export const deleteComment = async (postId, commentId) => {
  const res = await axios.delete(`/posts/${postId}/comments/${commentId}`);
  return res.data;
};