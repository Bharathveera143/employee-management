import { error } from "console";
import express,{Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
import { success } from "zod";

export const authenticateJWT = (req:Request,res:Response,next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({success:false,message:"Token not provided"});

    const token = authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string);
        (req as any).employee = decoded;
        next();
    }
    catch(err:any){
        if(err.name === "TokenExpiredError") return res.status(401).json({success:false,message:"Token Expired"});
        return res.status(403).json({success:false,message:"Invalid Token",error:err});
    }
}

