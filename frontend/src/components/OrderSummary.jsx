
const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const OrderSummary = ({ cart }) => {
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.product?.price || 0);
    const quantity = Number(item.quantity || 0);
    return sum + price * quantity;
  }, 0);

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold text-stone-900">
        Order Summary
      </h2>

      <div className="space-y-4">
        {cart.map((item) => {
          const product = item.product || {};
          const productId = product._id || item.product;
          const quantity = Number(item.quantity || 0);

          return (
            <div
              key={productId}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name || "Product"}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                )}

                <div>
                  <p className="font-medium text-stone-900">
                    {product.name || "Product"}
                  </p>
                  <p className="text-sm text-stone-500">
                    Quantity: {quantity}
                  </p>
                </div>
              </div>

              <p className="shrink-0 font-semibold">
                {formatPrice(
                  Number(product.price || 0) * quantity
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-between border-t border-stone-200 pt-4 text-lg font-bold">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <p className="mt-2 text-xs text-stone-500">
        Final price and stock are revalidated by the server.
      </p>
    </section>
  );
};

export default OrderSummary;
