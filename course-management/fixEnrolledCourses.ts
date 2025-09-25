import { UserModel } from "./src/models/user";
import { CourseModel } from "./src/models/course";
import mongoose from "mongoose";


async function fixEnrolledCourses() {
  await mongoose.connect("mongodb://localhost:27017/yourDBName"); // உங்கள் DB name
  const students = await UserModel.find();

  for (const student of students) {
    if (Array.isArray(student.enrolledCourses[0])) {
      student.enrolledCourses = student.enrolledCourses.flat();
      await student.save();
      console.log(`Fixed student: ${student._id}`);
    }
  }

  console.log("All students fixed");
  await mongoose.disconnect();
}

fixEnrolledCourses().catch(err => console.error(err));
