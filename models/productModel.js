import mongoose from "mongoose"

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    stock:{
        stype:String,
        required:true
    },
    salesPrice:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }

},{timestamps:true})

export const Product=mongoose.model("Product",productSchema);


