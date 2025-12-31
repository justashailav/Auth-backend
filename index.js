import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./config/db.js"
import cors from "cors";
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import addressRoute from "./routes/addressRoute.js"
import orderRoute from "./routes/orderRoute.js"
const app=express();
dotenv.config({});
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://shailav.netlify.app"
  ],
  credentials: true
};

const PORT = process.env.PORT || 4000;
app.use(cors(corsOptions));
connectDb()

app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/cart",cartRoute);
app.use("/api/v1/address",addressRoute);
app.use("/api/v1/order",orderRoute);
app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
})
