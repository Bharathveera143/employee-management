import { EmployeeModel } from "../models/employee";
import bcrypt from "bcrypt";
import { create } from "domain";
import jwt from "jsonwebtoken";
import { fi } from "zod/v4/locales";

export class EmployeeService {
    static async registerEmployee(data:any){
        const {name,email,password,department,salary} = data;
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await EmployeeModel.findOne({email:normalizedEmail});
        if(existing)throw new Error("Email Already Registered");


        const saltRounds = parseInt(process.env.SALT_ROUNDS || "10");
        const hashedPassword = await bcrypt.hash(password,saltRounds);

        const newEmployee = await EmployeeModel.create({
            name,
            email:normalizedEmail,
            password:hashedPassword,
            department,
            salary
        });

        const {password:_,...employeeWithoutPassword} = newEmployee.toObject();
        return employeeWithoutPassword;
    }

    static async loginEmployee(email:string,password:string){
        const normalizedEmail = email.trim().toLowerCase();
        const employee = await EmployeeModel.findOne({email:normalizedEmail});
        
        if(!employee) throw new Error("Employee Not Found");

        const isPasswordIsMatch = await bcrypt.compare(password,employee.password as string);
        if(!isPasswordIsMatch) throw new Error("Invalid Password");

        const token = jwt.sign({id:employee.id,email:employee.email},process.env.JWT_SECRET as string,{expiresIn:"1h"});
        const {password:_,...employeeWithoutPassword} = employee.toObject();
        return {token,employee:employeeWithoutPassword};
    }

    static async getEmployees(filter:any,skip:number,limit:number){
        const total = await EmployeeModel.countDocuments(filter);
        const employees = await EmployeeModel.find(filter,{password:0}).skip(skip).limit(limit).sort({createdAt:-1});
        return{total,employees}
    }

    static async getEmployeesById(id:string){
        const employee = await EmployeeModel.findById(id,{password:0})
        return employee;
    }

    static async updateEmployee(id:string,data:any){
        const updated = await EmployeeModel.findByIdAndUpdate(id,data,{new:true,runValidators:true}).select("-password");
        if(!updated) throw new Error("Employee Not Found");
        return updated;
    }

    static async deleteEmployee(id:string){
        const deleted = await EmployeeModel.findByIdAndDelete(id);
        if(!deleted) throw new Error("Employee Not Found");
        return deleted;
    }
}
