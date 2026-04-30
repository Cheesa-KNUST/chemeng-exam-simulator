import { courses } from "@/mock/courses";
import { exams } from "@/mock/exams";

/**
 * Step 1: Replace mock imports with a service layer.
 * Later this will be swapped with Firestore/API.
 */

export function getCourses() {
  return courses;
}

export function getExams() {
  return exams;
}

export function getExamsByCourse(courseSlug: string) {
  return exams.filter((e) => e.courseSlug === courseSlug);
}
