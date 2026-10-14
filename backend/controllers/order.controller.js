
import mongoose from "mongoose";
import crypto from "crypto";

import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import razorpay from "../config/razorpay.js";

// Validate and normalize the shipping address.
const validateAddress = (address) => {
  if (!address || typeof address !== "object") {
    return "Shipping address is required.";
  }

  const fields = [
    "fullName",
    "phone",
    "addressLine1",
    "city",
    "state",
    "pincode",
  ];

  for (const field of fields) {
    if (
      typeof address[field] !== "string" ||
      !address[field].trim()
    ) {
      return `${field} is required.`;
    }
  }

  // Indian mobile number: 10 digits starting from 6–9.
  if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
    return "Enter a valid 10-digit Indian mobile number.";
  }

  if (!/^\d{6}$/.test(address.pincode.trim())) {
    return "Pincode must contain exactly 6 digits.";
  }

  return null;
};

const cleanAddress = (address) => ({
  fullName: address.fullName.trim(),
  phone: address.phone.trim(),
  addressLine1: address.addressLine1.trim(),
  city: address.city.trim(),
  state: address.state.trim(),
  pincode: address.pincode.trim(),
});

// POST /orders/create-payment-order
export const createPaymentOrder = async (req, res) => {
  let savedOrder;

  try {
    const addressError = validateAddress(
      req.body.shippingAddress
    );

    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError,
      });
    }

    // req.user is set by your existing authMiddleware.
    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found. Please log in again.",
      });
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const snapshots = [];
    let totalAmount = 0;

    // Reload the current Product document for every cart item.
    for (const cartItem of customer.cart) {
      const quantity = Number(cartItem.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid cart quantity.",
        });
      }

      const product = await Product.findById(
        cartItem.product
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            "A product in your cart no longer exists. Please refresh your cart.",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}.`,
        });
      }

      const price = Number(product.price);

      if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${product.name}.`,
        });
      }

      snapshots.push({
        product: product._id,
        name: product.name,
        price,
        quantity,
        image: product.image || "",
      });

      totalAmount += price * quantity;
    }

    // Avoid floating-point currency rounding errors.
    totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;

    if (
      !Number.isSafeInteger(Math.round(totalAmount * 100)) ||
      totalAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order total.",
      });
    }

    // Save the ShopKart order first.
    savedOrder = await Order.create({
      user: customer._id,
      items: snapshots,
      shippingAddress: cleanAddress(
        req.body.shippingAddress
      ),
      totalAmount,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT",
    });

    // Razorpay expects the amount in paise.
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `sk_${savedOrder._id.toString()}`,
      notes: {
        shopkartOrderId: savedOrder._id.toString(),
        customerId: customer._id.toString(),
      },
    });

    savedOrder.razorpayOrderId = razorpayOrder.id;
    await savedOrder.save();

    return res.status(201).json({
      success: true,
      message: "Payment order created.",
      orderId: savedOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    // If Razorpay creation failed, do not leave a misleading
    // pending ShopKart order without a Razorpay order ID.
    if (savedOrder && !savedOrder.razorpayOrderId) {
      await Order.findByIdAndDelete(savedOrder._id).catch(
        () => {}
      );
    }

    console.error("Create payment order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
    });
  }
};

// POST /orders/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !mongoose.isValidObjectId(orderId) ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Required payment details are missing.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Idempotent retry if the same payment was already verified.
    if (order.paymentStatus === "PAID") {
      if (
        order.razorpayOrderId === razorpay_order_id &&
        order.razorpayPaymentId === razorpay_payment_id
      ) {
        return res.json({
          success: true,
          message: "Payment was already verified.",
          order,
        });
      }

      return res.status(409).json({
        success: false,
        message: "This order has already been paid.",
      });
    }

    if (order.status !== "PENDING_PAYMENT") {
      return res.status(400).json({
        success: false,
        message: "This order cannot be paid in its current state.",
      });
    }

    // Do not trust a Razorpay order ID supplied by the browser.
    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment order does not match.",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare buffers safely and reject malformed signatures.
    const expectedBuffer = Buffer.from(
      expectedSignature,
      "hex"
    );
    const receivedBuffer = Buffer.from(
      razorpay_signature,
      "hex"
    );

    const validSignature =
      /^[a-f0-9]{64}$/i.test(razorpay_signature) &&
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );

    if (!validSignature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    // Save payment first. Clear the cart only after this succeeds.
    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await Customer.updateOne(
      { _id: req.user._id },
      { $set: { cart: [] } }
    );

    return res.json({
      success: true,
      message: "Payment verified and order placed.",
      order,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify payment. Please check your order status before retrying.",
    });
  }
};

// GET /orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};

// GET /orders/:id
export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    // Filtering by both ID and owner prevents data leakage.
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order details.",
    });
  }
};
