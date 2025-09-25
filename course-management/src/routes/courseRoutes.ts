import { Router } from "express";
import { CourseController } from "../controllers/courseController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin operations
 *   - name: Instructor
 *     description: Instructor operations
 *   - name: Student
 *     description: Student operations
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     RegisterUserDTO:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name: { type: string }
 *         email: { type: string, format: email }
 *         password: { type: string, format: password }
 *     CourseDTO:
 *       type: object
 *       required: [title]
 *       properties:
 *         title: { type: string }
 *         description: { type: string }
 *     GetCoursesFilterDTO:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         description: { type: string }
 *         instructor: { type: string }
 */

/////////////////////// ADMIN ROUTES ///////////////////////

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterUserDTO' }
 *     responses:
 *       201: { description: Admin created successfully }
 *       400: { description: Bad Request }
 */
router.post("/admin/register", CourseController.registerAdmin);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login success + token }
 *       401: { description: Invalid credentials }
 */
router.post("/admin/login", CourseController.loginAdmin);

/**
 * @swagger
 * /admin/students:
 *   post:
 *     summary: Add a new student (Admin only)
 *     tags: [Admin]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterUserDTO' }
 *     responses:
 *       201: { description: Student added }
 *       403: { description: Forbidden }
 */
router.post("/admin/students", authenticateJWT(["admin"]), CourseController.addStudent);

/**
 * @swagger
 * /admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Admin]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: List of students }
 */
router.get("/admin/students", authenticateJWT(["admin"]), CourseController.getAllStudents);

/**
 * @swagger
 * /admin/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Admin]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Student deleted }
 *       404: { description: Student not found }
 */
router.delete("/admin/students/:id", authenticateJWT(["admin"]), CourseController.deleteStudent);

/**
 * @swagger
 * /admin/courses:
 *   post:
 *     summary: Add a course
 *     tags: [Admin]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CourseDTO' }
 *     responses:
 *       201: { description: Course added }
 */
router.post("/admin/courses", authenticateJWT(["admin"]), CourseController.addCourseAdmin);

/**
 * @swagger
 * /admin/courses:
 *   get:
 *     summary: Get all courses (with optional filter)
 *     tags: [Admin]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *       - in: query
 *         name: description
 *         schema: { type: string }
 *       - in: query
 *         name: instructor
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of courses }
 */
router.get("/admin/courses", authenticateJWT(["admin"]), CourseController.getCoursesAdmin);

/**
 * @swagger
 * /admin/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Admin]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: Course details }
 *       404: { description: Course not found }
 */
router.get("/admin/courses/:id", authenticateJWT(["admin"]), CourseController.getCourseByIdAdmin);

/**
 * @swagger
 * /admin/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Admin]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CourseDTO' }
 *     responses:
 *       200: { description: Course updated }
 *       404: { description: Course not found }
 */
router.put("/admin/courses/:id", authenticateJWT(["admin"]), CourseController.updateCourseByIdAdmin);

/**
 * @swagger
 * /admin/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Admin]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: Course deleted }
 *       404: { description: Course not found }
 */
router.delete("/admin/courses/:id", authenticateJWT(["admin"]), CourseController.deleteCourse);

//---------------- INSTRUCTOR ROUTES --------------------

/**
 * @swagger
 * /instructor/register:
 *   post:
 *     summary: Register a new instructor
 *     tags: [Instructor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterUserDTO' }
 *     responses:
 *       201: { description: Instructor created successfully }
 *       400: { description: Bad Request }
 */
router.post("/instructor/register", CourseController.registerInstructor);

/**
 * @swagger
 * /instructor/login:
 *   post:
 *     summary: Instructor login
 *     tags: [Instructor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login success + token }
 *       401: { description: Invalid credentials }
 */
router.post("/instructor/login", CourseController.loginInstructor);

/**
 * @swagger
 * /instructor/courses:
 *   post:
 *     summary: Add a new course (Instructor only)
 *     tags: [Instructor]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CourseDTO' }
 *     responses:
 *       201: { description: Course added }
 */
router.post("/instructor/courses", authenticateJWT(["instructor"]), CourseController.addCourseByInstructor);

/**
 * @swagger
 * /instructor/courses:
 *   get:
 *     summary: Get all courses created by instructor
 *     tags: [Instructor]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: List of courses }
 */
router.get("/instructor/courses", authenticateJWT(["instructor"]), CourseController.getCoursesInstructor);

/**
 * @swagger
 * /instructor/courses/{id}:
 *   get:
 *     summary: Get instructor's course by ID
 *     tags: [Instructor]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Course details }
 *       404: { description: Course not found }
 */
router.get("/instructor/courses/:id", authenticateJWT(["instructor"]), CourseController.getCourseByIdInstructor);

/**
 * @swagger
 * /instructor/courses/{id}:
 *   put:
 *     summary: Update a course (Instructor only)
 *     tags: [Instructor]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CourseDTO' }
 *     responses:
 *       200: { description: Course updated }
 *       404: { description: Course not found }
 */
router.put("/instructor/courses/:id", authenticateJWT(["instructor"]), CourseController.updateCourseByIdInstructor);

/**
 * @swagger
 * /instructor/courses/{courseId}/students:
 *   get:
 *     summary: Get students of a specific course
 *     tags: [Instructor]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of students }
 *       404: { description: Course not found }
 */
router.get("/instructor/courses/:courseId/students", authenticateJWT(["instructor"]), CourseController.getStudentOfMyCourse);


//--------------- STUDENT ROUTES -----------------

/**
 * @swagger
 * /student/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterUserDTO' }
 *     responses:
 *       201: { description: Student registered }
 *       400: { description: Bad Request }
 */
router.post("/student/register", CourseController.registerStudent);

/**
 * @swagger
 * /student/login:
 *   post:
 *     summary: Student login
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login success + token }
 *       401: { description: Invalid credentials }
 */
router.post("/student/login", CourseController.loginStudent);

/**
 * @swagger
 * /student/courses:
 *   get:
 *     summary: Get all available courses
 *     tags: [Student]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: List of courses }
 */
router.get("/student/courses", authenticateJWT(["student"]), CourseController.getAllCourses);

/**
 * @swagger
 * /student/buy:
 *   post:
 *     summary: Buy a course
 *     tags: [Student]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId]
 *             properties:
 *               courseId: { type: string }
 *     responses:
 *       200: { description: Course purchased }
 *       404: { description: Course not found }
 */
router.post("/student/buy", authenticateJWT(["student"]), CourseController.buyCourse);

/**
 * @swagger
 * /student/my-courses:
 *   get:
 *     summary: Get all enrolled courses of student
 *     tags: [Student]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: List of enrolled courses }
 */
router.get("/student/my-courses", authenticateJWT(["student"]), CourseController.getMyCourses);

/**
 * @swagger
 * /student/my-courses/{courseId}/complete:
 *   put:
 *     summary: Mark a course as completed
 *     tags: [Student]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Course marked completed }
 *       404: { description: Course not found }
 */
router.put("/student/my-courses/:courseId/complete", authenticateJWT(["student"]), CourseController.completeCourse);


export default router;