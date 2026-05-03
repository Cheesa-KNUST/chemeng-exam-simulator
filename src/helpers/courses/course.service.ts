import { courses as mockCourses } from "@/mock/courses";
import { exams as mockExams } from "@/mock/exams";

const API_URL = "process.env.NEXT_PUBLIC_API_URL";

export async function getCourses() {
  try {
    const res = await fetch(`${API_URL}/courses`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch {
    return mockCourses;
  }
}

export async function getExamsByCourse(courseSlug: string) {
  try {
    const res = await fetch(`${API_URL}/exams?courseSlug=${courseSlug}`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch {
    return mockExams.filter((e) => e.courseSlug === courseSlug);
  }
}
