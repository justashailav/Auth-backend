import { uploadMedia } from "../config/cloudinary.js";
import { Product } from "../models/productModel.js";

export const createProduct = async (req, res) => {
  try {
    const { productName, price, category, salesPrice, stock } = req.body;

    if (!productName || !price || !category || !salesPrice || !stock) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const files = req.files || [];

    let mainImage = null;
    let gallery = [];

    // ✅ ONLY upload if files exist
    if (files.length > 0) {
      const uploadedMain = await uploadMedia(files[0].path);
      mainImage = uploadedMain.secure_url;

      if (files.length > 1) {
        const uploadedGallery = await Promise.all(
          files.slice(1).map((file) => uploadMedia(file.path))
        );
        gallery = uploadedGallery.map((img) => img.secure_url);
      }
    }

    const product = await Product.create({
      productName,
      price,
      stock,
      salesPrice,
      category,
      image: mainImage,
      images: gallery,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
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
