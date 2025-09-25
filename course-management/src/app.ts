import express from "express";
import dotenv from "dotenv";
import CourseRoutes from "./routes/courseRoutes"
import { setupSwagger } from "./config/swagger.config";



dotenv.config();

const app = express();

app.use(express.json());


// Swagger Documentation

setupSwagger(app);

//Routes

app.use("/",CourseRoutes);

export default app;
