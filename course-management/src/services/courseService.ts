import { CourseModel, ICourse } from "../models/course";
import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { RegisterUserDTO } from "../dtos/userdto";
import { courseDTO, GetCoursesFilterDTO } from "../dtos/coursedto";
import { FilterQuery } from "mongoose";



export class CourseService {

    //Admin

    static async registerAdmin(data: RegisterUserDTO) {
        const { name, email, password } = data;
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await UserModel.findOne({ email: normalizedEmail });
        if (existing) throw new Error("Email Already Registered");


        const saltRounds = parseInt(process.env.SALT_ROUNDS || "10");
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newAdmin = await UserModel.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin"
        });

        const { password: _, ...adminWithoutPassword } = newAdmin.toObject();
        return adminWithoutPassword;
    }

    static async loginAdmin(email: string, password: string) {
        const normalizedEmail = email.trim().toLowerCase();
        const admin = await UserModel.findOne({ email: normalizedEmail });

        if (!admin) throw new Error("Admin Not Found");

        const isPasswordIsMatch = await bcrypt.compare(password, admin.password as string);
        if (!isPasswordIsMatch) throw new Error("Invalid Password");

        const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        const { password: _, ...adminWithoutPassword } = admin.toObject();
        return { token, admin: adminWithoutPassword };
    }

    //Admin add student

    static async addStudent(data: RegisterUserDTO) {
        const { name, email, password } = data;
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await UserModel.findOne({ email: normalizedEmail });
        if (existing) throw new Error("Email Already Registered")

        const saltRounds = parseInt(process.env.SALT_ROUNDS || "10");
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newStudent = await UserModel.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "student"
        });

        const { password: _, ...studentWithoutPassword } = newStudent.toObject();
        return studentWithoutPassword;
    }

    static async getAllStudents() {
        return await UserModel.find({ role: "student" }).populate("enrolledCourses", "title");
    }

    static async deleteStudent(id: string) {
        const deleted = await UserModel.findByIdAndDelete(id);
        if (!deleted) throw new Error("Student not found");
        return deleted;
    }

    //Admin add course

    static async addCourseAdmin(data: courseDTO) {
        const newCourse = await CourseModel.create(data);
        return newCourse;
    }

    static async getCoursesAdmin(filter: GetCoursesFilterDTO, skip: number = 0, limit: number = 10) {
        const query: FilterQuery<ICourse> = { ...filter }
        const total = await CourseModel.countDocuments(query);
        const courses = await CourseModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate("instructor", "name email");
        return { total, courses }
    }

    static async getCourseByIdAdmin(id: string) {
        const course = await CourseModel.findById(id)
        return course;
    }

    static async updateCourseByIdAdmin(id: string, data: Partial<ICourse>) {
        const updated = await CourseModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!updated) throw new Error("Course Not Found");
        return updated;
    }

    static async deleteCourse(id: string) {
        const deleted = await CourseModel.findByIdAndDelete(id);
        if (!deleted) throw new Error("Course Not Found");
        return deleted;
    }

    //Instructor

    static async registerInstructor(data: RegisterUserDTO) {
        const { name, email, password } = data;
        const normalizedEmail = email.trim().toLowerCase()
        const existing = await UserModel.findOne({ email: normalizedEmail })
        if (existing) throw new Error("Email Already Registered");

        const saltRounds = parseInt(process.env.SALT_ROUNDS || "10");
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newInstructor = await UserModel.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "instructor"
        });

        const { password: _, ...instructorWithOutPassword } = newInstructor.toObject();
        return (instructorWithOutPassword);
    }

    static async loginInstructor(email: string, password: string) {
        const normalizedEmail = email.trim().toLowerCase()
        const instructor = await UserModel.findOne({ email: normalizedEmail });

        if (!instructor) throw new Error("Instructor not found");

        const isPasswordIsMatch = await bcrypt.compare(password, instructor.password as string);
        if (!isPasswordIsMatch) throw new Error("Invalid Password")

        const token = jwt.sign({ id: instructor.id, role: instructor.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        const { password: _, ...instructorWithoutPassword } = instructor.toObject();
        return { token, instructor: instructorWithoutPassword };

    }

    static async addCourseByInstructor(data: courseDTO, instructorId: string) {
        const newCourse = await CourseModel.create({ ...data, instructor: instructorId });
        return newCourse;
    }

    static async getCoursesInstructor(
        filter: GetCoursesFilterDTO,
        skip: number = 0,
        limit: number = 10
    ) {
        const query: FilterQuery<ICourse> = { ...filter };
        const total = await CourseModel.countDocuments(query);
        const courses = await CourseModel.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("instructor", "name email");
        return { total, courses };
    }

    static async getCourseByIdInstructor(id: string) {
        const course = await CourseModel.findById(id);
        return course;
    }
    static async updateCourseByIdInstructor(
        id: string,
        data: Partial<ICourse>
    ) {
        const updated = await CourseModel.findByIdAndUpdate(id, data, {
            runValidators: true,
            new: true,
        });
        if (!updated) throw new Error("Course Not Found");
        return updated;
    }

    static async getStudentOfMyCourse(instructorId: string, courseId: string) {
        const courseObjId = new mongoose.Types.ObjectId(courseId);

        const course = await CourseModel.findOne({ _id: courseObjId, instructor: new mongoose.Types.ObjectId(instructorId) });
        if (!course) throw new Error("Course not found or you are not the instructor");

        const students = await UserModel.find({ role: "student" }).select("name email enrolledCourses");

        const filteredStudents = students
            .map(student => {
                const flattened = student.enrolledCourses.flat(2); // 2-level flatten
                if (flattened.some(ec => ec.course.toString() === courseId)) {
                    return {
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                        enrolledCourses: flattened
                    };
                }
                return null;
            })
            .filter(s => s !== null);

        return filteredStudents;
    }




    //------------Student----------------

    static async registerStudent(data: RegisterUserDTO) {
        return await this.addStudent(data);  
    }

    static async loginStudent(email: string, password: string) {
        const normalizedEmail = email.trim().toLowerCase();
        const student = await UserModel.findOne({ email: normalizedEmail });
        if (!student) throw new Error("Student not found");

        const isPasswordIsMatch = await bcrypt.compare(password, student.password as string);
        if (!isPasswordIsMatch) throw new Error("Invalid Password");

        const token = await jwt.sign({ id: student.id, role: student.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        const { password: _, ...studentWithoutPassword } = student.toObject();
        return { token, student: studentWithoutPassword };
    }

    static async getAllCourses() {
        return await CourseModel.find().populate("instructor", "name email");
    }

    static async buyCourse(studentId: string, courseId: string) {
        const student = await UserModel.findById(studentId).exec();
        if (!student) throw new Error("Student not found");

        if (student.enrolledCourses.some(id => id.toString() === courseId)) {
            throw new Error("Already Purchased")
        }
        student.enrolledCourses.push({ course: new mongoose.Types.ObjectId(courseId), completed: false });
        await student.save();
        return { message: "Course purchased successfully" }
    }

    static async getMyCourses(studentId: string) {
        const student = await UserModel.findById(studentId)
            .populate<{ enrolledCourses: { course: ICourse; completed: boolean }[] }>({
                path: "enrolledCourses.course",
                model: "Course",
                select: "title description instructor",
                populate: { path: "instructor", select: "name email" },
            })
            .exec();

        if (!student) throw new Error("Student not found");

        const courses = (student.enrolledCourses.flat())
            .filter(ec => ec.course)
            .map(ec => ({
                courseId: ec.course._id,
                title: ec.course.title,
                description: ec.course.description,
                instructor: ec.course.instructor,
                completed: ec.completed ?? false,
                status: ec.completed ? "Completed" : "Inprogress",
            }));

        return courses;
    }


    static async completeCourse(studentId: string, courseId: string) {
        const student = await UserModel.findById(studentId);
        if (!student) throw new Error("Student not found");

        const enrolledCourse = student.enrolledCourses.flat().find(ec =>
            ec.course.toString() === courseId || ec.course._id?.toString() === courseId
        );


        if (!enrolledCourse) throw new Error("Course not enrolled");
        enrolledCourse.completed = true;
        await student.save();

        return { message: "Course marked as completed" }
    }
}
