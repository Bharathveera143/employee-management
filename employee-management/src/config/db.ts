import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () =>{

    try{
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB Connected Succesfully");
        
    }
    catch(err){
        console.error("MongoDB Connection Error.....!",err)
    }
}