import api from "./axios";

export const getAllProducts  = (params) => api.get("/products", { params });
export const getProductBySlug = (slug)  => api.get(`/products/${slug}`);
export const getProductById   = (id)    => api.get(`/products/${id}`);