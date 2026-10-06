import express from "express";
import {
    addProductToWishlist,
    getWishlist,
    removeProductFromWishlist
} from "../controllers/wishlist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const wishlistRoutes = express.Router();

wishlistRoutes.get("/", authMiddleware, getWishlist);
wishlistRoutes.post("/:productId", authMiddleware, addProductToWishlist);
wishlistRoutes.delete("/:productId", authMiddleware, removeProductFromWishlist);

export default wishlistRoutes;
