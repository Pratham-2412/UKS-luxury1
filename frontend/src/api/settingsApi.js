import api from "./axios";

export const getSiteSettings = () => api.get("/site-settings");
export const getHeroSections = () => api.get("/hero-sections");