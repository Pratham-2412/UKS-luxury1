import api from "./axios";

export const getAllOffers = (params) =>
  api.get("/offers", { params });

export const getOfferById = (id) =>
  api.get(`/offers/${id}`);

export const fetchOffers = getAllOffers;
export const fetchOfferById = getOfferById;