import express from "express";
import dotenv from "dotenv";
import employeeRoutes from "./routes/employeeRoutes";
import { setupSwagger } from "./config/swagger.config";



dotenv.config();

const app = express();

app.use(express.json());


// Swagger Documentation

setupSwagger(app);

//Routes

app.use('/employees',employeeRoutes);

export default app;
