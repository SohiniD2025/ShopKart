import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

const isValidProductId = (productId) =>
    typeof productId === "string" && /^[0-9a-fA-F]{24}$/.test(productId);

export const addProductToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!isValidProductId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId).select("_id");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const customer = await Customer.findById(req.user._id);

        const alreadySaved = customer.wishlist.some(
            (savedProductId) => savedProductId.toString() === productId
        );

        if (alreadySaved) {
            return res.status(409).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        customer.wishlist.push(product._id);
        await customer.save();

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist"
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: "wishlist",
            select: "name price category image stock"
        });

        const wishlist = customer.wishlist.filter(Boolean);

        return res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const removeProductFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!isValidProductId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const customer = await Customer.findById(req.user._id);

        const productInWishlist = customer.wishlist.some(
            (savedProductId) => savedProductId.toString() === productId
        );

        if (!productInWishlist) {
            return res.status(404).json({
                success: false,
                message: "Product not in wishlist"
            });
        }

        customer.wishlist = customer.wishlist.filter(
            (savedProductId) => savedProductId.toString() !== productId
        );

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
