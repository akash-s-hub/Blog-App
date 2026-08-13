import api from "./axios";

export const getCategories = () => api.get("/categories");
export const createCategory = (category) => api.post("/categories", { category });