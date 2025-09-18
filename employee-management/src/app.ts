import express from "express";
import dotenv from "dotenv";
import employeeRoutes from "./routes/employeeRoutes";



dotenv.config();
const app = express();
app.use(express.json());
app.use('/employees',employeeRoutes);

export default app;
