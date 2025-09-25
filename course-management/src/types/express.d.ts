import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface UserPayload extends JwtPayload {
      id: string;
      role: "admin" | "instructor" | "student";
    }

    interface Request {
      user: UserPayload;
    }
  }
}
