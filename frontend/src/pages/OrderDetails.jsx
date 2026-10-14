
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { fetchOrderById } from "../services/api";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const OrderDetails = () => {
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
              "Unable to load order details."
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
      <main className="mx-auto max-w-4xl px-6 py-10">
        Loading order details...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold">
          Order not available
        </h1>
        <p className="mt-3 text-red-600">
          {error || "Order not found."}
        </p>
        <Link
          to="/orders"
          className="mt-5 inline-block text-emerald-700 underline"
        >
          Back to My Orders
        </Link>
      </main>
    );
  }

  const address = order.shippingAddress;

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/orders"
          className="text-sm font-semibold text-emerald-700 hover:underline"
        >
          ← Back to My Orders
        </Link>

        <h1 className="mt-5 text-3xl font-bold">
          Order Details
        </h1>

        <section className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-500">Order ID</p>
          <p className="break-all font-semibold">{order._id}</p>

          <p className="mt-3 text-sm text-stone-500">
            Placed on
          </p>
          <p>{new Date(order.createdAt).toLocaleString("en-IN")}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-stone-500">
                Order status
              </p>
              <p className="font-semibold">{order.status}</p>
            </div>

            <div>
              <p className="text-sm text-stone-500">
                Payment status
              </p>
              <p className="font-semibold">
                {order.paymentStatus}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-bold">Items</h2>

          <div className="mt-4 divide-y divide-stone-100">
            {order.items.map((item, index) => (
              <div
                key={`${item.product}-${index}`}
                className="flex items-center gap-4 py-4"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}

                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-stone-500">
                    {money(item.price)} × {item.quantity}
                  </p>
                </div>

                <p className="font-bold">
                  {money(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{money(order.totalAmount)}</span>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-bold">
            Shipping Address
          </h2>

          <div className="mt-3 space-y-1 text-stone-700">
            <p>{address.fullName}</p>
            <p>{address.phone}</p>
            <p>{address.addressLine1}</p>
            <p>
              {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrderDetails;
