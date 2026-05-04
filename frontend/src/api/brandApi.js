import api from "./axios";

export const getAllBrands = () => api.get("/brands");
