import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
    const {
        cart,
        loading,
        error,
        cartCount,
        subtotal,
        refreshCart,
        updateQuantity,
        removeFromCart
    } = useCart();

    const [updatingId, setUpdatingId] = useState("");
    const [removingId, setRemovingId] = useState("");
    const [actionError, setActionError] = useState("");

    // Increase quantity (Respecting stock limits)
    const handleIncrease = async (item) => {
        const productId = item.product?._id || item.product;
        const currentQty = item.quantity;
        const stock = item.product?.stock || 0;

        if (currentQty >= stock) {
            setActionError(`Cannot add more. Only ${stock} units available in stock.`);
            return;
        }

        try {
            setActionError("");
            setUpdatingId(productId);
            await updateQuantity(productId, currentQty + 1);
        } catch (err) {
            setActionError(err.message || "Failed to update quantity.");
        } finally {
            setUpdatingId("");
        }
    };

    // Decrease quantity (Lower bound = 1)
    const handleDecrease = async (item) => {
        const productId = item.product?._id || item.product;
        const currentQty = item.quantity;

        if (currentQty <= 1) {
            return; // Below 1 is rejected; user should click "Remove" instead
        }

        try {
            setActionError("");
            setUpdatingId(productId);
            await updateQuantity(productId, currentQty - 1);
        } catch (err) {
            setActionError(err.message || "Failed to update quantity.");
        } finally {
            setUpdatingId("");
        }
    };

    // Remove item from cart
    const handleRemove = async (item) => {
        const productId = item.product?._id || item.product;
        try {
            setActionError("");
            setRemovingId(productId);
            await removeFromCart(productId);
        } catch (err) {
            setActionError(err.message || "Failed to remove product from cart.");
        } finally {
            setRemovingId("");
        }
    };

    // 1. Loading State
    if (loading && cart.length === 0) {
        return (
            <main className="min-h-screen bg-stone-50 px-6 py-10 flex items-center justify-center">
                <p className="text-stone-600 text-lg">Loading your cart...</p>
            </main>
        );
    }

    // 2. Error State
    if (error && cart.length === 0) {
        return (
            <main className="min-h-screen bg-stone-50 px-6 py-10">
                <div className="mx-auto mt-10 max-w-md rounded-xl border border-red-100 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-stone-900">
                        Unable to load your cart.
                    </h1>
                    <p className="mt-3 text-stone-600 text-sm">
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={refreshCart}
                        className="mt-6 rounded-md bg-stone-900 px-5 py-3 font-semibold text-white hover:bg-stone-800 transition"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    // 3. Empty State
    if (!cart || cart.length === 0) {
        return (
            <main className="min-h-screen bg-stone-50 px-6 py-10">
                <section className="mx-auto mt-10 max-w-md rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-2xl">
                        🛒
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-stone-900">
                        Your cart is empty 🛒
                    </h1>

                    <p className="mt-3 text-stone-600">
                        Looks like you haven't added anything yet.
                    </p>

                    <Link
                        to="/products"
                        className="mt-6 inline-flex rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 transition"
                    >
                        Browse Products
                    </Link>
                </section>
            </main>
        );
    }

    // 4. Cart View with Items and Order Summary
    return (
        <main className="min-h-screen bg-stone-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold text-stone-900 mb-2">My Cart</h1>
                <p className="text-stone-500 mb-6">
                    {cartCount} {cartCount === 1 ? "unit" : "units"} across {cart.length} {cart.length === 1 ? "item" : "items"}
                </p>

                {actionError && (
                    <div className="mb-6 rounded-lg bg-red-100 text-red-700 px-4 py-3 text-sm">
                        {actionError}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => {
                            const product = item.product || {};
                            const productId = product._id || item.product;
                            const isUpdating = updatingId === productId;
                            const isRemoving = removingId === productId;
                            const itemTotal = (product.price || 0) * item.quantity;
                            const isAtMaxStock = item.quantity >= (product.stock || 0);

                            return (
                                <div
                                    key={productId}
                                    className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full sm:w-32 h-32 object-cover rounded-lg"
                                    />

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h2 className="text-lg font-bold text-stone-900">
                                                    {product.name}
                                                </h2>
                                                <p className="text-lg font-bold text-stone-900">
                                                    ₹{itemTotal.toLocaleString()}
                                                </p>
                                            </div>

                                            <p className="text-sm text-stone-500">
                                                ₹{product.price} each • {product.category}
                                            </p>

                                            <p className="text-xs text-stone-400 mt-1">
                                                Available stock: {product.stock}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity Controls: [-] qty [+] */}
                                            <div className="flex items-center border border-stone-300 rounded-lg">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrease(item)}
                                                    disabled={isUpdating || item.quantity <= 1}
                                                    className="px-3 py-1 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-l-lg font-bold"
                                                    title={item.quantity <= 1 ? "Minimum quantity is 1" : "Decrease quantity"}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 font-semibold text-stone-900 min-w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrease(item)}
                                                    disabled={isUpdating || isAtMaxStock}
                                                    className="px-3 py-1 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-r-lg font-bold"
                                                    title={isAtMaxStock ? "Max stock reached" : "Increase quantity"}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(item)}
                                                disabled={isRemoving}
                                                className="text-sm font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-50"
                                            >
                                                {isRemoving ? "Removing..." : "Remove"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm sticky top-6">
                            <h2 className="text-xl font-bold text-stone-900 mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 border-b border-stone-200 pb-4 text-stone-600">
                                <div className="flex justify-between">
                                    <span>Total Units</span>
                                    <span className="font-semibold text-stone-900">{cartCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Items in Cart</span>
                                    <span className="font-semibold text-stone-900">{cart.length}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-4 text-lg font-bold text-stone-900">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>

                            <button
                                type="button"
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                                onClick={() => alert("Proceeding to checkout in Lab 06!")}
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                to="/products"
                                className="block text-center mt-4 text-sm font-semibold text-emerald-700 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cart;