
import { Link } from "react-router-dom";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const OrderCard = ({ order }) => {
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <p className="text-sm text-stone-500">Order ID</p>
          <p className="break-all font-semibold">
            {order._id}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-lg font-bold">
            {money(order.totalAmount)}
          </p>
          <span className="mt-1 inline-block rounded-full bg-stone-100 px-3 py-1 text-sm font-medium">
            {order.status}
          </span>
          <p className="mt-1 text-xs text-stone-500">
            Payment: {order.paymentStatus}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-stone-100 pt-4">
        {order.items.map((item, index) => (
          <div
            key={`${item.product}-${index}`}
            className="flex items-center gap-3"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="h-12 w-12 rounded-md object-cover"
              />
            )}

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-stone-500">
                Quantity: {item.quantity}
              </p>
            </div>

            <p className="text-sm font-semibold">
              {money(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Link
          to={`/orders/${order._id}`}
          className="inline-flex rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-stone-50"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default OrderCard;
