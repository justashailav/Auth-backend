import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./config/db.js"
import cors from "cors";
import userRoute from "./routes/userRoute.js"

const app=express();
dotenv.config({});
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
const PORT = process.env.PORT || 4000;
app.use(cors(corsOptions));
connectDb()

app.use("/api/v1/user",userRoute);

app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
})
