import api from "./axios";

export const getPublicSubcategories = (params) => api.get("/subcategories", { params });
export const getPublicSubcategoryBySlug = (slug) => api.get(`/subcategories/${slug}`);
export const getPublicSubcategoryItemsBySlug = (slug) => api.get(`/subcategory-items/by-subcategory/${slug}`);
