import api from "./axios";

export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my-orders");
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const createRazorpayOrder = (data) => api.post("/payments/create-order", data);
export const verifyPayment = (data) => api.post("/payments/verify", data);