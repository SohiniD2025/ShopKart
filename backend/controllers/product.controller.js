import Product from "../models/product.model.js";


export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            stock
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (err) {
        console.log(err);

        return res.status(400).json({
            success: false,
            message: "Invalid product data"
        });
    }
};


export const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        const query = {};

        // Search by product name
        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query);

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (err) {
        console.log(err);

        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
};