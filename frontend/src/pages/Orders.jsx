
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchOrders } from "../services/api";
import OrderCard from "../components/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchOrders();
      setOrders(response.data.orders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              My Orders
            </h1>
            <p className="mt-2 text-stone-600">
              View your purchases and payment statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 font-semibold hover:bg-stone-100 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <p className="py-10 text-center text-stone-600">
            Loading your orders...
          </p>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={loadOrders}
              className="mt-4 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <section className="rounded-xl border border-stone-200 bg-white p-10 text-center">
            <div className="text-4xl">📦</div>
            <h2 className="mt-4 text-xl font-bold">
              No orders yet
            </h2>
            <p className="mt-2 text-stone-600">
              You have not placed any orders yet.
            </p>
            <Link
              to="/products"
              className="mt-5 inline-block rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white"
            >
              Start Shopping
            </Link>
          </section>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;
