import express from "express";
import { createOrder, getMyOrders, getOrderById, verifyRazorpayPayment } from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/isAuthenciated.js";

const router = express.Router();
router.post("/create", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyRazorpayPayment);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/:id", isAuthenticated, getOrderById);
router.put("/cancel/:id", isAuthenticated, cancelOrder);


// Get all orders
router.get("/admin/all",isAuthenticated,authorizeRoles("admin"),getAllOrders);

// Update order status
router.put(
  "/admin/update/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateOrderStatus
);

// Mark order as delivered
router.put(
  "/admin/deliver/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  markOrderDelivered
);

export default router;
