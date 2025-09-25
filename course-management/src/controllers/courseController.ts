import { Request, Response } from "express";
import { CourseService } from "../services/courseService";
import { RegisterUserDTO } from "../dtos/userdto";
import { courseDTO, GetCoursesFilterDTO } from "../dtos/coursedto";
import mongoose from "mongoose";
import { UserModel } from "../models/user";
import { CourseModel } from "../models/course";

export class CourseController {
    //------ Admin --------
    static async registerAdmin(req: Request, res: Response) {
        try {
            const data: RegisterUserDTO = req.body;
            const admin = await CourseService.registerAdmin(data);
            res.status(201).json(admin);
        }
        catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async loginAdmin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await CourseService.loginAdmin(email, password);
            res.status(200).json(result);
        }
        catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
    static async addStudent(req: Request, res: Response) {
        try {
            const data: RegisterUserDTO = req.body;
            const student = await CourseService.addStudent(data);
            res.status(201).json(student);
        }
        catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllStudents(req: Request, res: Response) {
        try {
            const students = await CourseService.getAllStudents();
            res.json(students);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteStudent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await CourseService.deleteStudent(id);
            res.json(deleted);
        }
        catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    static async addCourseAdmin(req: Request, res: Response) {
        try {
            const data: courseDTO = req.body;
            const course = await CourseService.addCourseAdmin(data);
            res.status(201).json(course);
        }
        catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getCoursesAdmin(req: Request, res: Response) {
        try {
            const filter: GetCoursesFilterDTO = req.query as any;
            const { skip = 0, limit = 10 } = req.query;
            const result = await CourseService.getCoursesAdmin(filter, Number(skip), Number(limit));
            res.json(result);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCourseByIdAdmin(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const course = await CourseService.getCourseByIdAdmin(id);
            if (!course) return res.status(404).json({ error: "Course not found" });
            res.json(course);
        }
        catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateCourseByIdAdmin(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updated = await CourseService.updateCourseByIdAdmin(id, req.body);
            res.json(updated);
        }
        catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    static async deleteCourse(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await CourseService.deleteCourse(id);
            res.json(deleted);
        }
        catch (error: any) {
            res.status(404).json({ error: error.message })
        }
    }


    //---------Instructor----------

    static async registerInstructor(req: Request, res: Response) {
        try {
            const data: RegisterUserDTO = req.body;
            const instructor = await CourseService.registerInstructor(data);
            res.json(instructor)
        }
        catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async loginInstructor(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await CourseService.loginInstructor(email, password);
            res.json(result);
        }
        catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    static async addCourseByInstructor(req: Request, res: Response) {
        try {
            const data: courseDTO = req.body;
            const instructorId = req.user.id;
            const course = await CourseService.addCourseByInstructor(data, instructorId);
            res.status(201).json(course);
        }
        catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getCoursesInstructor(req: Request, res: Response) {
        try {
            const filter: GetCoursesFilterDTO = req.query as any;
            const { skip = 0, limit = 10 } = req.query;
            const result = await CourseService.getCoursesInstructor(filter, Number(skip), Number(limit));
            res.json(result);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCourseByIdInstructor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const course = await CourseService.getCourseByIdInstructor(id);
            if (!course) return res.status(404).json({ error: "Course not found" });
            res.json(course);
        }
        catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateCourseByIdInstructor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updated = await CourseService.updateCourseByIdInstructor(id, req.body);
            if (!updated) return res.status(404).json({ error: "Course not found" });
            res.json(updated);
        }
        catch (error: any) {
            res.status(404).json({ error: error.message })
        }

    }

    static async getStudentOfMyCourse(req: Request, res: Response) {
        try {
            const instructorId = req.user.id; // JWT middleware-ல் set பண்ணிய user
            const { courseId } = req.params;
            const students = await CourseService.getStudentOfMyCourse(instructorId, courseId);
            res.json(students);
        } catch (error: any) {
            res.status(403).json({ error: error.message });
        }
    }


    //---------Student-----------

    static async registerStudent(req: Request, res: Response) {
        try {
            const data: RegisterUserDTO = req.body
            const student = await CourseService.registerStudent(data);
            res.status(201).json(student);
        }
        catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async loginStudent(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await CourseService.loginStudent(email, password);
            res.json(result);
        }
        catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }


    // Double array fix helper
    private static async fixEnrolledCourses(studentId: string) {
        const student = await UserModel.findById(studentId);
        if (!student) throw new Error("Student not found");

        if (Array.isArray(student.enrolledCourses[0])) {
            student.enrolledCourses = student.enrolledCourses.flat();
            await student.save();
        }

        return student;
    }

    static async getAllCourses(req: Request, res: Response) {
        try {
            const courses = await CourseService.getAllCourses()
            res.json(courses);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async buyCourse(req: Request, res: Response) {
        try {
            const studentId = req.user.id;
            const { courseId } = req.body;
            const result = await CourseService.buyCourse(studentId, courseId);
            res.json(result);
        }

        catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getMyCourses(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const studentId = req.user.id;
            const courses = await CourseService.getMyCourses(studentId);

            res.json(courses);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async completeCourse(req: Request, res: Response) {
        try {
            const studentId = req.user.id;
            const { courseId } = req.params;
            const result = await CourseService.completeCourse(studentId, courseId);
            res.json(result);
        }
        catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

}