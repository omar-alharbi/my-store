import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// إضافة التوكن تلقائياً لكل طلب
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("userInfo");
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

// المنتجات
export const getProducts = ()     => API.get("/products");
export const getProduct  = (id)   => API.get(`/products/${id}`);

// المصادقة
export const loginUser    = (data) => API.post("/auth/login",    data);
export const registerUser = (data) => API.post("/auth/register", data);

// الطلبات
export const createOrder = (data) => API.post("/orders",  data);
export const getMyOrders = ()      => API.get("/orders/my");