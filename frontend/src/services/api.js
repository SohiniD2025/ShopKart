import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});




export const registerCustomer = (payload) =>
    api.post("/customers/register", payload);

export const loginCustomer = (payload) =>
    api.post("/customers/login", payload);

export const fetchProfile = () =>
    api.get("/customers/me");

export const logoutCustomer = () =>
    api.post("/customers/logout");




export const createProduct = (payload) =>
    api.post("/products", payload);

export const fetchProducts = (params = {}) =>
    api.get("/products", {
        params
    });

export const fetchProductById = (id) =>
    api.get(`/products/${id}`);

export const addProductToWishlist = (productId) =>
    api.post(`/wishlist/${productId}`);

export const fetchWishlist = () =>
    api.get("/wishlist");

export const removeProductFromWishlist = (productId) =>
    api.delete(`/wishlist/${productId}`);


export default api;
