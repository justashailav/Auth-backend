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

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, price, category, salesPrice, stock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const files = req.files || [];

    let mainImage = product.image;
    let gallery = product.images;

    if (files.length > 0) {
      const uploadedMain = await uploadMedia(files[0].path);
      mainImage = uploadedMain.secure_url;

      if (files.length > 1) {
        const uploadedGallery = await Promise.all(
          files.slice(1).map((file) => uploadMedia(file.path))
        );
        gallery = uploadedGallery.map((img) => img.secure_url);
      } else {
        gallery = [];
      }
    }

    product.productName = productName ?? product.productName;
    product.price = price ?? product.price;
    product.salesPrice = salesPrice ?? product.salesPrice;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.image = mainImage;
    product.images = gallery;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
