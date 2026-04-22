import api from "./axios";

export const submitEnquiry = (data) => api.post("/enquiries", data);