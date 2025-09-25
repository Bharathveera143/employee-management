import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  email: string;
  role: "admin" | "instructor" | "student";
}

export const authenticateJWT = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
      }

      const token = authHeader.split(" ")[1]; 
      if (!token) {
        return res.status(401).json({ error: "Invalid token format" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      (req as any).user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient permission" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Token invalid or expired" });
    }
  };
};
