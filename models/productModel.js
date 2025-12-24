import mongoose from "mongoose"

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    salesPrice:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    }

},{timestamps:true})

export const Product=mongoose.model("Product",productSchema);


