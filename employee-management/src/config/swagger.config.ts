import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";


const options : swaggerJsdoc.Options = {
    definition : {
        openapi : "3.0.0",
        info:{
            title:"Employee Backend Api",
            version:"1.0.0",
            description:"API documentation for employee Management System",
        },
    servers:[
        {
            url:"http://localhost:3000"
        },
    ],
    components:{
        securitySchemes:{
            bearerAuth : {
                type:"http",
                scheme:"bearer",
                bearerFormat:"JWT"
            },
        },
    },
    security:[{bearerAuth:[]}]
    },
    apis:["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app:Express)=>{
    app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));
}