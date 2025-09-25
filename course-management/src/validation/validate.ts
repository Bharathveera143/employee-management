import { z } from "zod";

export const userSchema= z.object({
  name: z.string().min(3,"Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6,"Password must be at least 6 characters"),
  role: z.enum(["admin","instructor","student"]).optional()
});

export const courseSchema = z.object({
  title:z.string().min(3, "Title must be at least 3 characters"),
  description:z.string().optional(),
  price:z.number().positive().optional(),
  category:z.string().optional()
})

export type RegistrationInput = z.infer<typeof userSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
