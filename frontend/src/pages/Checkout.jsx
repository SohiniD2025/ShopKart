
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import {
  createPaymentOrder,
  verifyPayment,
} from "../services/api";

import OrderSummary from "../components/OrderSummary";

const initialAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () =>
        resolve(true), { once: true }
      );
      existingScript.addEventListener("error", () =>
        resolve(false), { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading, clearCart } = useCart();

  const [address, setAddress] = useState(initialAddress);
  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    for (const [field, value] of Object.entries(address)) {
      if (!value.trim()) {
        nextErrors[field] = "This field is required.";
      }
    }

    if (
      address.phone.trim() &&
      !/^[6-9]\d{9}$/.test(address.phone.trim())
    ) {
      nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (
      address.pincode.trim() &&
      !/^\d{6}$/.test(address.pincode.trim())
    ) {
      nextErrors.pincode = "Pincode must contain 6 digits.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPageError("");

    if (!validate()) return;

    if (!cart.length) {
      setPageError("Your cart is empty.");
      return;
    }

    setProcessing(true);

    try {
      // The backend receives the address only.
      const response = await createPaymentOrder({
        ...address,
        fullName: address.fullName.trim(),
        phone: address.phone.trim(),
        addressLine1: address.addressLine1.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      });

      const checkoutData = response.data;

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        setPageError(
          "Unable to load Razorpay Checkout. Please try again."
        );
        return;
      }

      const options = {
        key: checkoutData.keyId,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        name: "ShopKart",
        description: "ShopKart purchase",
        order_id: checkoutData.razorpayOrderId,

        handler: async (paymentResponse) => {
          try {
            const verification = await verifyPayment({
              orderId: checkoutData.orderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (!verification.data.success) {
              setPageError(
                "Payment could not be verified. Check My Orders before retrying."
              );
              return;
            }

            // Clear React state only after backend verification.
            clearCart();

            navigate(
              `/order-success/${checkoutData.orderId}`,
              { replace: true }
            );
          } catch (error) {
            setPageError(
              error.response?.data?.message ||
                "Payment verification could not be completed. Check My Orders before retrying."
            );
          }
        },

        prefill: {
          name: address.fullName.trim(),
          contact: address.phone.trim(),
        },

        notes: {
          shopkartOrderId: checkoutData.orderId,
        },

        theme: {
          color: "#047857",
        },

        modal: {
          ondismiss: () => {
            setPageError(
              "Checkout was closed. Your cart has not been cleared."
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (paymentError) => {
        setPageError(
          paymentError.error?.description ||
            "Payment failed. You can try again."
        );
      });

      razorpay.open();
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          "Unable to start checkout. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading && cart.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        Loading your cart...
      </main>
    );
  }

  if (!cart.length) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-4 text-stone-600">
          Your cart is empty.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-block rounded-lg bg-emerald-700 px-5 py-3 text-white"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  const fields = [
    ["fullName", "Full Name", "text"],
    ["phone", "Phone Number", "tel"],
    ["addressLine1", "Address Line", "text"],
    ["city", "City", "text"],
    ["state", "State", "text"],
    ["pincode", "Pincode", "text"],
  ];

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-stone-900">
          Checkout
        </h1>
        <p className="mb-8 text-stone-600">
          Enter your shipping details and review your order.
        </p>

        {pageError && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {pageError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold">
              Shipping Details
            </h2>

            {fields.map(([name, label, type]) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="mb-1 block text-sm font-medium text-stone-700"
                >
                  {label}
                </label>

                <input
                  id={name}
                  name={name}
                  type={type}
                  value={address[name]}
                  onChange={handleChange}
                  autoComplete={
                    name === "fullName"
                      ? "name"
                      : name === "phone"
                        ? "tel"
                        : "off"
                  }
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={
                    errors[name] ? `${name}-error` : undefined
                  }
                />

                {errors[name] && (
                  <p
                    id={`${name}-error`}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors[name]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing
                ? "Preparing payment..."
                : "Place Order & Pay"}
            </button>

            <Link
              to="/cart"
              className="block text-center text-sm font-medium text-stone-600 hover:underline"
            >
              Return to Cart
            </Link>
          </form>

          <OrderSummary cart={cart} />
        </div>
      </div>
    </main>
  );
};

export default Checkout;
