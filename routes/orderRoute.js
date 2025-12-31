import express from "express";
import { cancelOrder, createOrder, getAllOrders, getMyOrders, getOrderById, markOrderDelivered, updateOrderStatus, verifyRazorpayPayment } from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/isAuthenciated.js";

const router = express.Router();
router.post("/create", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyRazorpayPayment);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/:id", isAuthenticated, getOrderById);
router.put("/cancel/:id", isAuthenticated, cancelOrder);



// router.get("/admin/all",isAuthenticated,authorizeRoles("admin"),getAllOrders);

// router.put(
//   "/admin/update/:id",
//   isAuthenticated,
//   authorizeRoles("admin"),
//   updateOrderStatus
// );

// router.put(
//   "/admin/deliver/:id",
//   isAuthenticated,
//   authorizeRoles("admin"),
//   markOrderDelivered
// );

export default router;
