import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name:String,
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    department:String,
    salary:Number,
},{timestamps:true});

export const EmployeeModel = mongoose.model("Employee",employeeSchema);