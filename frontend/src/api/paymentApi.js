import api from "./axios";

export const createPaymentIntent = (data) => api.post("/payments/intent", data);
export const confirmPayment      = (data) => api.post("/payments/confirm", data);