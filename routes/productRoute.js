import express from "express"
import { createProduct, getAllProducts } from "../controllers/productController.js"
import upload from "../utils/multer.js";

const router =express.Router()

router.post("/create-product",upload.array("images", 5),createProduct);
router.get("/getAllProducts",getAllProducts)

export default router;