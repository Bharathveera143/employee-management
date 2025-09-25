import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
    try{
        mongoose.connect(process.env.MONGO_URI as string)
        console.log("MongoDB Connected Successfully");
        
    }

    catch(err){
        console.error("MongoDB connection error.....!",err)
    }
    
}