import express from "express"
import { createProduct, getAllProducts } from "../controllers/productController.js"

const router =express.Router()

router.post("/create-product",createProduct);
router.get("/getAllProducts",getAllProducts)