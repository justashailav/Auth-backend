import { Product } from "../models/productModel.js";

export const createProduct = async (req, res) => {
  try {
    const { productName, price, category,salesPrice,stock } = req.body;
    if (!productName || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "productName, price and category are required",
      });
    }
    const product = await Product.create({
      productName,
      price,
      stock,
      salesPrice,
      category,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

