import mongoose from "mongoose"

const productSchema=new mongoose.Schema({
    productName:{
        type:string,
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

},{timestamps:truw})

export const Product=mongoose.model("Product",productSchema);


