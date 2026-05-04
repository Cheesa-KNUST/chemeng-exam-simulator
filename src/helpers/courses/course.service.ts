// import { useAuth } from "@/context/AuthContext";

export async function getCourses(level?: number, semester?: number) {
  const params = new URLSearchParams();

  if (level) params.append("level", String(level));
  if (semester) params.append("semester", String(semester));

  const res = await fetch(`/api/courses?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return await res.json();
}

export async function getCourseBySlug(slug: string) {
  const res = await fetch(`/api/courses/${slug}`);

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch course");
  }

  return await res.json();
}

export async function getExamsByCourse(courseSlug: string) {
  const res = await fetch(`/api/exams?courseSlug=${courseSlug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch exams for course");
  }

  return await res.json();
}
