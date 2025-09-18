import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  department: z.string(),
  salary: z.number().positive()
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
