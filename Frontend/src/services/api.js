// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach token to every request if available
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Foods
// export const getFoods = () => api.get("/foods");
// export const getFoodById = (id) => api.get(`/foods/${id}`);

// // Auth
// export const login = (credentials) => api.post("/auth/login", credentials);
// export const register = (userData) => api.post("/auth/register", userData);

// // Orders
// export const addOrder = (orderData) => api.post("/orders", orderData);

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getFoods    = ()       => api.get("/foods");
export const getFoodById = (id)     => api.get(`/foods/${id}`);
export const login       = (data)   => api.post("/auth/login", data);
export const register    = (data)   => api.post("/auth/register", data);
export const addOrder    = (data)   => api.post("/orders", data);
export const getOrders   = ()       => api.get("/orders");
export const getOrderById = (id)    => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}`, { status });
export const getDeliveries = ()     => api.get("/delivery/orders");
export const acceptDelivery = (id)  => api.patch(`/delivery/orders/${id}/accept`);
export const updateDeliveryStatus = (id, status) => api.patch(`/delivery/orders/${id}/status`, { status });
export const getAdminStats = ()     => api.get("/admin/stats");
export const getAdminUsers = ()     => api.get("/admin/users");
export const getAdminRestaurants = () => api.get("/admin/restaurants");
export const getAdminFoods = ()     => api.get("/admin/foods");
export const getAdminOrders = ()    => api.get("/admin/orders");

export default api;