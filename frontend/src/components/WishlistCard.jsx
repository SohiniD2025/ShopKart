import { Link } from "react-router-dom";

const WishlistCard = ({ product, isRemoving, onRemove }) => {
    const stockLabel = product.stock > 0 ? `${product.stock} units left` : "Out of stock";

    return (
        <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
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
                    {stockLabel}
                </p>

                <div className="mt-4 grid gap-3">
                    <Link
                        to={`/products/${product._id}`}
                        className="min-h-11 rounded-md bg-emerald-700 px-4 py-2 text-center font-semibold text-white hover:bg-emerald-800"
                    >
                        View Details
                    </Link>

                    <button
                        type="button"
                        onClick={() => onRemove(product._id)}
                        disabled={isRemoving}
                        className="min-h-11 rounded-md border border-rose-200 px-4 py-2 font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isRemoving ? "Removing..." : "Remove from Wishlist"}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default WishlistCard;
