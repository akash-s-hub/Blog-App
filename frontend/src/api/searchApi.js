import api from "./axios";

export const searchPosts = (query) => api.get(`/search?q=${encodeURIComponent(query)}`);