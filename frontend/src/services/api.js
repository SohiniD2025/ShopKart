import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080/customers",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export const registerCustomer = (payload) => {
  return api.post("/register", payload);
};

export const loginCustomer = (payload) => {
  return api.post("/login", payload);
};

export const fetchProfile = () => {
  return api.get("/me");
};

export const logoutCustomer = () => {
  return api.post("/logout");
};

export default api;