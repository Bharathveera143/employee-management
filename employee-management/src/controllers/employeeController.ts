import { Request,Response } from "express";
import { EmployeeService } from "../services/employeeService";
import { regex, success } from "zod";
import { tr } from "zod/v4/locales";
import { error } from "console";

export class EmployeeController{
    static async register(req:Request,res:Response){
        try{
            const employee = await EmployeeService.registerEmployee(req.body);
            res.json({success:true,message:"Employee Registerd Successfully",employee})
        }
        catch(err:any){
            res.status(400).json({success:false,message:err.message})
        }
    }
    static async login(req:Request,res:Response){
        try{
            const{email,password} = req.body;
            const result = await EmployeeService.loginEmployee(email,password);
            res.json({success:true,message:"Login Successful",...result})
        }
        catch(err:any){
            res.status(400).json({success:false,message:err.message})
        }
    }

    static async getAll(req:Request,res:Response){
        try{
            let{page,limit,name,email,id,department,salary,minSalary,maxSalary} = req.query;

            const pageNumber = parseInt(page as string) || 1;
            const pageSize = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * pageSize;

            const filter:any = {};
            if(id)filter._id = id;
            if(name)filter.name = {$regex:new RegExp(name as string,'i')};
            if(email)filter.email = {$regex:new RegExp(name as string,'i')};
            if(department)filter.department = {$regex:new RegExp(department as string,'i')};

            if(salary)filter.salary = Number(salary);
            else if(minSalary || maxSalary){
                filter.salary = {};
                if(minSalary) filter.salary.$gte = Number(minSalary);
                if(maxSalary) filter.salary.lte = Number(maxSalary);
            }
            const data = await EmployeeService.getEmployees(filter,skip,pageSize);
            res.json({success:true,message:"Employee Data Fetched Successfully",page:pageNumber,limit:pageSize,...data});
        }

        catch(err:any){
            res.status(500).json({success:false,message:"Server Error",error:err.message});
        }
    }

    static async getById(req:Request,res:Response){
        try{
            const employee = await EmployeeService.getEmployeesById(req.params.id);
            res.json({success:true,message:"Employee Data Fetched Successfully",employee});
        }
        catch(err:any){
            res.status(404).json({success:false,message:err.message})
        }
    }

    static async update(req:Request,res:Response){
        try{
            const updated = await EmployeeService.updateEmployee(req.params.id,req.body);
            res.json({success:true,message:"Employee Updated Successfully",employee:updated})
        }

        catch(err:any){
            res.status(404).json({success:false,message:err.message})
        }
    }

    static async delete(req:Request,res:Response){
        try{
            await EmployeeService.deleteEmployee(req.params.id);
            res.json({success:true,message:"Employee Deleted Successfully"})
        }

        catch(err:any){
            res.status(404).json({success:false,message:err.message})
        }
    }
}