import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        productName: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        price: {
          type: Number, 
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },

        stock: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Cart=mongoose.model("Cart",productSchema);
