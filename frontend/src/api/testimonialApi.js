import api from "./axios";

export const getAllTestimonials = (params) =>
  api.get("/testimonials", { params });

export const getTestimonialById = (id) =>
  api.get(`/testimonials/${id}`);

export const fetchTestimonials = getAllTestimonials;
export const fetchTestimonialById = getTestimonialById;