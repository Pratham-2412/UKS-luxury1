import api from "./axios";

export const getAllCollections = (params) =>
  api.get("/collections", { params });

export const getCollectionBySlug = (slug) =>
  api.get(`/collections/${slug}`);

export const getCollectionProductsBySlug = (slug) =>
  api.get(`/collections/${slug}/products`);

export const fetchCollections = getAllCollections;
export const fetchCollectionBySlug = getCollectionBySlug;
export const fetchCollectionProducts = getCollectionProductsBySlug;