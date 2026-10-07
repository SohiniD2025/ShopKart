import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProductToWishlist } from "../services/api";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { cart, addToCart } = useCart();

    // Wishlist local states
    const [saving, setSaving] = useState(false);
    const [added, setAdded] = useState(false);
    const [wishlistMessage, setWishlistMessage] = useState("");

    // Cart local states
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [cartError, setCartError] = useState(false);

    // Check if this product is already in the global cart
    const cartItem = cart.find(
        (item) => (item.product?._id || item.product) === product._id
    );
    const inCart = Boolean(cartItem);

    // Add to Wishlist handler (existing Lab-04 logic)
    const handleAddToWishlist = async () => {
        if (saving || added) return;

        try {
            setSaving(true);
            setWishlistMessage("");

            await addProductToWishlist(product._id);

            setAdded(true);
            setWishlistMessage("Added to Wishlist");
            window.dispatchEvent(new Event("wishlist:changed"));
        } catch (error) {
            const status = error.response?.status;

            if (status === 409) {
                setAdded(true);
                setWishlistMessage("Already in your wishlist");
                return;
            }

            if (status === 401) {
                setWishlistMessage("Please log in to save products.");
                return;
            }

            setWishlistMessage("Unable to save product. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Add to Cart handler (Task 7 requirement)
    const handleAddToCart = async () => {
        if (addingToCart) return;

        try {
            setAddingToCart(true);
            setCartMessage("");
            setCartError(false);

            await addToCart(product._id);

            setCartMessage(inCart ? "Added another unit!" : "Added to Cart!");
        } catch (err) {
            setCartError(true);
            setCartMessage(err.message || "Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm flex flex-col justify-between">
            <div>
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-52 w-full rounded-md object-cover"
                />

                <div className="mt-4">
                    <h2 className="text-lg font-bold text-stone-900">
                        {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-stone-500">
                        {product.category}
                    </p>

                    <p className="mt-2 text-xl font-bold text-emerald-700">
                        ₹{product.price}
                    </p>

                    <p className="mt-1 text-sm text-stone-500">
                        {product.stock} units left
                    </p>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                {/* 1. Primary "Add to Cart" button (Task 7) */}
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock <= 0}
                    className="w-full min-h-11 rounded-md bg-stone-900 px-4 py-2 font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 transition"
                >
                    {addingToCart
                        ? "Adding..."
                        : product.stock <= 0
                        ? "Out of Stock"
                        : inCart
                        ? `Add Another (${cartItem.quantity} in cart)`
                        : "Add to Cart"}
                </button>

                {/* 2. Secondary buttons: View Details & Wishlist */}
                <div className="grid gap-2 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="min-h-11 rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
                    >
                        View Details
                    </button>

                    <button
                        type="button"
                        onClick={handleAddToWishlist}
                        disabled={saving || added}
                        className="min-h-11 rounded-md border border-rose-200 px-4 py-2 font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-rose-100 disabled:bg-rose-50 disabled:text-rose-500"
                    >
                        {saving ? "Saving..." : added ? "In Wishlist" : "Wishlist"}
                    </button>
                </div>

                {/* Cart Feedback Message */}
                {cartMessage && (
                    <p className={`text-xs mt-1 text-center font-medium ${cartError ? "text-red-600" : "text-emerald-700"}`}>
                        {cartMessage}
                    </p>
                )}

                {/* Wishlist Feedback Message */}
                {wishlistMessage && (
                    <p className={`text-xs mt-1 text-center font-medium ${added ? "text-emerald-700" : "text-red-600"}`}>
                        {wishlistMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;