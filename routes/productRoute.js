import express from "express"
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/productController.js"
import upload from "../utils/multer.js";

const router =express.Router()
router.post("/create-product",upload.array("images", 5),createProduct);
router.get("/getAllProducts",getAllProducts)
router.put("/update-product/:id",upload.array("images", 5),updateProduct)
router.delete("/delete-product/:id",deleteProduct)
export default router;