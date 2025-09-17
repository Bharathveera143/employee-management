import {z} from "zod";

export const registrationSchema = z.object({
    name:z.string().min(3,"Name must be at least 3 characters"),         
    email:z.string().email("Invalid email format"),
    password:z.string().min(6,"Password must be at least 6 characters"), 
    department:z.string().min(2,"Department is required"),
    salary:z.number().positive("Salary must be positive")
})


export type RegistrationInput = z.infer<typeof registrationSchema>