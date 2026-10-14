
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrderById } from "../services/api";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchOrderById(id)
      .then((response) => {
        if (active) setOrder(response.data.order);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load this order."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        Loading order confirmation...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold">
          Unable to load order
        </h1>
        <p className="mt-3 text-red-600">
          {error || "Order not found."}
        </p>
        <Link
          to="/orders"
          className="mt-5 inline-block text-emerald-700 underline"
        >
          Check My Orders
        </Link>
      </main>
    );
  }

  const paid =
    order.paymentStatus === "PAID" &&
    order.status === "PLACED";

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12">
      <section className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">
          {paid ? "✅" : "⏳"}
        </div>

        <h1 className="mt-4 text-3xl font-bold text-stone-900">
          {paid
            ? "Order Placed Successfully!"
            : "Payment Status"}
        </h1>

        <p className="mt-3 text-stone-600">
          {paid
            ? "Your payment was verified and your order has been saved."
            : "Your order is not yet confirmed. Check My Orders before retrying payment."}
        </p>

        <div className="mt-8 space-y-4 rounded-xl bg-stone-50 p-5 text-left">
          <div>
            <p className="text-sm text-stone-500">
              Order ID
            </p>
            <p className="break-all font-semibold">
              {order._id}
            </p>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-stone-600">Total</span>
            <span className="font-bold">
              {money(order.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-stone-600">
              Payment
            </span>
            <span className="font-semibold">
              {order.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-stone-600">
              Order status
            </span>
            <span className="font-semibold">
              {order.status}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/orders"
            className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="rounded-lg border border-stone-300 px-5 py-3 font-semibold hover:bg-stone-50"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccess;
