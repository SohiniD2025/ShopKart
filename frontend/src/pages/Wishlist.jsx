import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WishlistCard from "../components/WishlistCard";
import { fetchWishlist, removeProductFromWishlist } from "../services/api";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [removingProductId, setRemovingProductId] = useState("");

    const loadWishlist = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setActionError("");

            const response = await fetchWishlist();

            setWishlist(response.data.wishlist || []);
        } catch (err) {
            console.log(err);

            setError("Unable to load wishlist.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadWishlist();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [loadWishlist]);

    const handleRemove = async (productId) => {
        if (removingProductId) {
            return;
        }

        try {
            setRemovingProductId(productId);
            setActionError("");

            await removeProductFromWishlist(productId);

            setWishlist((currentWishlist) =>
                currentWishlist.filter((product) => product._id !== productId)
            );
            window.dispatchEvent(new Event("wishlist:changed"));
        } catch (err) {
            console.log(err);

            const message =
                err.response?.data?.message ||
                "Unable to remove product from wishlist.";

            setActionError(message);
        } finally {
            setRemovingProductId("");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-stone-50 px-6 py-10">
                <p className="mt-10 text-center text-stone-600">
                    Loading your wishlist...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-stone-50 px-6 py-10">
                <div className="mx-auto mt-10 max-w-md rounded-lg border border-red-100 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-stone-900">
                        Something went wrong.
                    </h1>

                    <p className="mt-3 text-stone-600">
                        We could not load your wishlist.
                    </p>

                    <button
                        type="button"
                        onClick={loadWishlist}
                        className="mt-6 rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    if (wishlist.length === 0) {
        return (
            <main className="min-h-screen bg-stone-50 px-6 py-10">
                <section className="mx-auto mt-10 max-w-md rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-sm font-semibold text-rose-600">
                        Love
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-stone-900">
                        Your wishlist is empty
                    </h1>

                    <p className="mt-3 text-stone-600">
                        Start saving products you love and find them here later.
                    </p>

                    <Link
                        to="/products"
                        className="mt-6 inline-flex rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
                    >
                        Browse Products
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-stone-50 px-6 py-10">
            <section className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">
                            My Wishlist
                        </h1>

                        <p className="mt-2 text-stone-500">
                            {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="rounded-md border border-stone-300 bg-white px-5 py-3 text-center font-semibold text-stone-800 hover:bg-stone-100"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {actionError && (
                    <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">
                        {actionError}
                    </div>
                )}

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((product) => (
                        <WishlistCard
                            key={product._id}
                            product={product}
                            isRemoving={removingProductId === product._id}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Wishlist;
