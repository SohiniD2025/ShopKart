import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /cart/:productId - Add product to cart (or increment quantity if already present)
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.stock <= 0) {
            return res.status(400).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        const customer = await Customer.findById(req.user._id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!customer.cart) {
            customer.cart = [];
        }

        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        if (!cartItem) {
            // New item added with quantity 1
            customer.cart.push({
                product: product._id,
                quantity: 1
            });
        } else {
            // Item already present, increment quantity
            if (cartItem.quantity + 1 > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds available stock"
                });
            }
            cartItem.quantity += 1;
        }

        await customer.save();
        await customer.populate({
            path: "cart.product",
            select: "name price image stock category"
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: customer.cart.filter((item) => item.product)
        });
    } catch (err) {
        console.error("addToCart error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET /cart - Get current authenticated user's cart
export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: "cart.product",
            select: "name price image stock category"
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const cart = (customer.cart || []).filter((item) => item.product);

        return res.status(200).json({
            success: true,
            cart
        });
    } catch (err) {
        console.error("getCart error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// PATCH /cart/:productId - Update quantity of a product in the cart
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const parsedQuantity = Number(quantity);
        if (
            quantity === undefined ||
            quantity === null ||
            isNaN(parsedQuantity) ||
            parsedQuantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const customer = await Customer.findById(req.user._id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!customer.cart) {
            customer.cart = [];
        }

        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        if (parsedQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Quantity exceeds available stock"
            });
        }

        cartItem.quantity = parsedQuantity;
        await customer.save();
        await customer.populate({
            path: "cart.product",
            select: "name price image stock category"
        });

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: customer.cart.filter((item) => item.product)
        });
    } catch (err) {
        console.error("updateCartQuantity error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// DELETE /cart/:productId - Remove product from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const customer = await Customer.findById(req.user._id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!customer.cart) {
            customer.cart = [];
        }

        const productInCart = customer.cart.some(
            (item) => item.product.toString() === productId
        );

        if (!productInCart) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        customer.cart = customer.cart.filter(
            (item) => item.product.toString() !== productId
        );

        await customer.save();
        await customer.populate({
            path: "cart.product",
            select: "name price image stock category"
        });

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: customer.cart.filter((item) => item.product)
        });
    } catch (err) {
        console.error("removeFromCart error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
