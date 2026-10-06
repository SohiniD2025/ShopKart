import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProductToWishlist } from "../services/api";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [added, setAdded] = useState(false);
    const [message, setMessage] = useState("");

    const handleAddToWishlist = async () => {
        if (saving || added) {
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            await addProductToWishlist(product._id);

            setAdded(true);
            setMessage("Added to Wishlist");
            window.dispatchEvent(new Event("wishlist:changed"));
        } catch (error) {
            const status = error.response?.status;

            if (status === 409) {
                setAdded(true);
                setMessage("Already in your wishlist");
                return;
            }

            if (status === 401) {
                setMessage("Please log in to save products.");
                return;
            }

            setMessage("Unable to save product. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
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
                    Rs. {product.price}
                </p>

                <p className="mt-1 text-sm text-stone-500">
                    {product.stock} units left
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                        {saving ? "Saving..." : added ? "Added to Wishlist" : "Add to Wishlist"}
                    </button>
                </div>

                {message && (
                    <p className={`mt-3 text-sm ${added ? "text-emerald-700" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
