import mongoose,{Schema,Document,Types} from "mongoose";
import { userSchema } from "../validation/validate";
import { boolean } from "zod";
import { ICourse } from "./course";



export interface IEnrolledCourse {
    course: Types.ObjectId | ICourse;
    completed: boolean;
}

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    role:"admin"|"instructor"|"student";
    enrolledCourses:IEnrolledCourse[];
    createdAt:Date;
    updatedAt:Date;
}


const EnrolledCourseSchema = new Schema<IEnrolledCourse>(
    {
    course:{type:Schema.Types.ObjectId,ref:"Course",required:true},
    completed:{type:Boolean,default:false},
    },
    {_id:false}
)

const UserSchema:Schema<IUser> = new Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,trim:true,unique:true,lowercase:true},
        password:{type:String,required:true},
        role:{type:String,enum:["admin","instructor","student"],required:true},
        enrolledCourses:[{type:[EnrolledCourseSchema],default:[]}],
    },
    {timestamps:true}
);

export const UserModel = mongoose.model<IUser>("User",UserSchema);
