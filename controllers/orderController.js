import Razorpay from "razorpay";
import crypto from "crypto";
import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod = "COD" } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate stock only (do NOT reduce yet)
    for (let item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.productName}`,
        });
      }

      totalAmount += item.price * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.productName,
        image: product.image,
        price: item.price,
        quantity: item.quantity,
      });
    }

    // ================= COD =================
    if (paymentMethod === "COD") {
      // Reduce stock immediately
      for (let item of cart.items) {
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save();
      }

      const order = await Order.create({
        user: req.user._id,
        orderItems,
        address: addressId,
        totalAmount,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
      });

      cart.items = [];
      await cart.save();

      return res.status(201).json({
        success: true,
        message: "Order placed successfully (COD)",
        order,
      });
    }

    // ================= RAZORPAY =================
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      address: addressId,
      totalAmount,
      paymentMethod: "RAZORPAY",
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).json({
      success: true,
      razorpayOrder,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Reduce stock now
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: order.user },
      { items: [] }
    );

    res.status(200).json({
      success: true,
      message: "Payment successful",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("address")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // security: user can only see own order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    // mark delivered
    if (status === "DELIVERED") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // user can cancel only own order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (["SHIPPED", "DELIVERED"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    // restore stock
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      await product.save();
    }

    order.orderStatus = "CANCELLED";
    order.paymentStatus =
      order.paymentMethod === "RAZORPAY" ? "REFUND_PENDING" : "CANCELLED";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = "DELIVERED";
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
