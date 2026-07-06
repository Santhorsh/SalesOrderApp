import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://localhost:5001/api",
});

export const clientsApi = {
  getAll: () => api.get("/clients"),
  getById: (id) => api.get(`/clients/${id}`),
};

export const itemsApi = {
  getAll: () => api.get("/items"),
};

export const salesOrdersApi = {
  getAll: () => api.get("/salesorders"),
  getById: (id) => api.get(`/salesorders/${id}`),
  create: (payload) => api.post("/salesorders", payload),
  update: (id, payload) => api.put(`/salesorders/${id}`, payload),
};

export default api;
