import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { registrationSchema, RegistrationInput } from "./validation/validate";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { regex, success } from "zod";
import { error } from "console";


dotenv.config();


console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);


const app = express();
const PORT = 3000;

//------- Middleware data parsing -------

app.use(express.json());


//------ MongoDB Connection ------

mongoose.connect("mongodb://127.0.0.1:27017/employee")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error...!", err))

//------- Employee Schema -------

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: String,
  salary: Number,
}, { timestamps: true });

const employeeModel = mongoose.model("Employee", employeeSchema);

//------- JWT Middleware ----------

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ Success: false, message: "Token Not Provided" });
  }
  const token = authHeader.split(" ")[1]; //Bearer Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).employee = decoded;
    next();
  }
  catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ Seccess: false, Message: "Token Expired" });
    }
    return res.status(403).json({ Success: false, Message: "Invalid Token", error: err })

  }
}


//-------- Registration Route ---------

app.post('/register', async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);  //<==== Debug
    const validatedData: RegistrationInput = registrationSchema.parse(req.body)
    const { name, email, password, department, salary } = validatedData;

    const normalizedEmail = email.trim().toLowerCase();

    const existingEmployee = await employeeModel.findOne({ email: normalizedEmail })
    if (existingEmployee) {
      return res.status(400).json({ Success: false, Message: "Email Already Registred" })
    }

    //-------- Password using bcrypt and salt  ---------

    const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10)
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const newEmployee = await employeeModel.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      department,
      salary,
    })

    const { password: _, ...employeeWithoutPassword } = newEmployee.toObject();
    res.json({ Success: true, Message: "Employee Registered Successfully", employee: employeeWithoutPassword })
  }
  catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ Success: false, Message: "Validation Failed", errors: err.errors })
    }
    if (err.code === 11000) {
      return res.status(400).json({ Success: false, Message: "Email Already Exists" })
    }
    return res.status(500).json({ Success: false, Message: "Server Error", error: err })
  }
});


//------- Login Route --------

app.post('/login', async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body
    const normalizedEmail = email.trim().toLowerCase()
    const employee = await employeeModel.findOne({ email: normalizedEmail });
    if (!employee) {
      return res.status(400).json({ Success: false, Message: "User Not Found" })
    }

    const isPasswordMatch = await bcrypt.compare(password, employee.password as string);
    if (!isPasswordMatch) {
      return res.status(400).json({ Success: false, Message: "Invalid Password" });
    }

    //--------JWT Authentication --------

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set")
    }

    const token = jwt.sign({ id: employee.id, email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated Token : ", token);


    const { password: _, ...employeeWithoutPassword } = employee?.toObject();
    return res.json({ Success: true, Message: "Login Successful", token, employee: employeeWithoutPassword });
  }
  catch (err) {
    res.status(500).json({ Success: false, Message: "Server Error" });
  }
});




//------- Get All Employees Using Pagination & Filtered -----------

app.get('/employees', authenticateJWT, async (req: Request, res: Response) => {

  try {
    let { page, limit, name, email, id, department, salary, minSalary, maxSalary } = req.query;

    //Default pagination values

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;


    //Built Filter Object

    const filter: any = {};
    if (id) filter._id = id;
    if (name) filter.name = { $regex: new RegExp(name as string, 'i') };        // case-insensitive
    if (email) filter.email = { $regex: new RegExp(email as string, 'i') };
    if (department) filter.department = { $regex: new RegExp(department as string, 'i') };


    if (salary) {
      filter.salary = Number(salary);
    } else if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    const totalEmployees = await employeeModel.countDocuments(filter);
    const employees = await employeeModel
      .find(filter, { password: 0 })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });     //latest First


    res.json({ Success: true, Message: "Employee data fetched successfully", page: pageNumber, limit: pageSize, total: totalEmployees, employees })
  }
  catch (err) {
    res.status(500).json({ Success: false, Message: "Server Error", error: err instanceof Error ? err.message : err });
  }
})

// -------- Get Single Employee By MongoDB id --------

app.get('/employees/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await employeeModel.findById(id, { password: 0 });
    if (!employee) {
      return res.status(404).json({ Success: false, Message: "Employee Not Found" })


    }
    res.json({ Success: true, Message: "Employee Data Fetched Successfully", employee })
  }
  catch (err) {
    res.status(500).json({ Success: false, Message: "Server Error", error: err instanceof Error ? err.message : err })
  }
})


//-------- Update Employee (Protected) --------

app.put('/employees/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, department, salary } = req.body
    const updatedEmployee = await employeeModel.findByIdAndUpdate(id, { name, email, department, salary }, { new: true, runValidators: true }
    ).select("-password")  //don't return password

    if (!updatedEmployee) {
      return res.status(404).json({ Success: false, Message: "Employee Not Found" })
    }
    res.json({ Success: true, Message: "Employee Updated Successfully", employee: updatedEmployee })
  }
  catch (err) {
    res.status(500).json({ Success: false, Message: "Server Error", error: err })
  }
})


//---------- Delete Employee(Protected) -------

app.delete('/employees/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteEmployee = await employeeModel.findByIdAndDelete(id);

    if (!deleteEmployee) {
      return res.status(404).json({ Success: false, Message: "Employee Not Found" })
    }
    res.json({ Success: true, Message: "Employee Deleted Successfully" });
  }
  catch (err) {
    res.status(500).json({ Success: false, Message: "Server Error", error: err })
  };
});

//-------- Server Start --------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}) 