import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const connectDb=async()=>{
    mongoose.connect(process.env.DATABASE_URL,{

    })
    .then(()=>console.log("DB connected"))
    .catch((error)=>{
        console.error(error);
        console.log("DB Failed");
        process.exit(1);
    })
}
export default connectDb;