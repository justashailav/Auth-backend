import express from "express"
import { addToCart, getCart, removeFromCart, updateCart } from "../controllers/cartController.js";
import { isAuthenticated } from "../middleware/isAuthenciated.js";

const router =express.Router()
router.post("/add-cart",isAuthenticated,addToCart);
router.get("/getCart",isAuthenticated,getCart)
router.put("/update-cart", isAuthenticated, updateCart);
router.delete("/remove-cart/:productId", isAuthenticated, removeFromCart);

export default router;