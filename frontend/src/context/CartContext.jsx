import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
    fetchCart,
    addToCart as apiAddToCart,
    updateCartQuantity as apiUpdateCartQuantity,
    removeFromCart as apiRemoveFromCart
} from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load cart from backend
    const refreshCart = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetchCart();
            setCart(response.data.cart || []);
        } catch (err) {
            // If 401 (not logged in), silent fail so unauthenticated users aren't shown error
            if (err.response?.status !== 401) {
                console.error("Failed to load cart:", err);
                setError(err.response?.data?.message || "Unable to load your cart.");
            } else {
                setCart([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    // Add product to cart
    const handleAddToCart = async (productId) => {
        try {
            const response = await apiAddToCart(productId);
            if (response.data?.cart) {
                setCart(response.data.cart);
            } else {
                await refreshCart();
            }
            return { success: true, message: response.data?.message || "Added to cart" };
        } catch (err) {
            console.error("Add to cart error:", err);
            const message = err.response?.data?.message || "Failed to add to cart.";
            throw new Error(message);
        }
    };

    // Update quantity
    const handleUpdateQuantity = async (productId, quantity) => {
        try {
            const response = await apiUpdateCartQuantity(productId, quantity);
            if (response.data?.cart) {
                setCart(response.data.cart);
            } else {
                await refreshCart();
            }
            return { success: true };
        } catch (err) {
            console.error("Update quantity error:", err);
            const message = err.response?.data?.message || "Failed to update quantity.";
            throw new Error(message);
        }
    };

    // Remove product from cart
    const handleRemoveFromCart = async (productId) => {
        try {
            const response = await apiRemoveFromCart(productId);
            if (response.data?.cart) {
                setCart(response.data.cart);
            } else {
                setCart((prev) => prev.filter((item) => (item.product?._id || item.product) !== productId));
            }
            return { success: true };
        } catch (err) {
            console.error("Remove from cart error:", err);
            const message = err.response?.data?.message || "Failed to remove item.";
            throw new Error(message);
        }
    };

    // Derived cart count: sum of quantities across items
    const cartCount = useMemo(() => {
        return cart.reduce((total, item) => total + (item.quantity || 0), 0);
    }, [cart]);

    // Derived subtotal: sum of (price * quantity)
    const subtotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + price * (item.quantity || 0);
        }, 0);
    }, [cart]);

    const value = {
        cart,
        loading,
        error,
        cartCount,
        subtotal,
        refreshCart,
        addToCart: handleAddToCart,
        updateQuantity: handleUpdateQuantity,
        removeFromCart: handleRemoveFromCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
