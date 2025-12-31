import express from "express";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/addressController.js";
import { isAuthenticated } from "../middleware/isAuthenciated.js";
const router = express.Router();
router.post("/add", isAuthenticated, addAddress);
router.get("/get", isAuthenticated, getAddresses);
router.put("/update/:id", isAuthenticated, updateAddress);
router.delete("/delete/:id", isAuthenticated, deleteAddress);

export default router;
