import mongoose,{Document,Schema,Types} from "mongoose";
import { IUser } from "./user";


export interface IEnrolledCourse {
    course:mongoose.Types.ObjectId;
    completed:boolean;
}


export interface ICourse extends Document{
    _id: Types.ObjectId;
    title:string;
    description?: string;
    instructor: Types.ObjectId | IUser;
    createdAt:Date;
    updatedAt:Date;
}



const CourseSchema:Schema<ICourse> = new Schema({
    title:{type:String,required:true,trim:true},
    description:{type:String,trim:true},
    instructor:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
},{timestamps:true});

export const CourseModel = mongoose.model<ICourse>("Course",CourseSchema,"courses");
