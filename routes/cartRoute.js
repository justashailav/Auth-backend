import express from "express"
import { addToCart, getCart } from "../controllers/cartController.js";
import { isAuthenticated } from "../middleware/isAuthenciated.js";

const router =express.Router()
router.post("/add-cart",isAuthenticated,addToCart);
router.get("/getCart",isAuthenticated,getCart)

export default router;