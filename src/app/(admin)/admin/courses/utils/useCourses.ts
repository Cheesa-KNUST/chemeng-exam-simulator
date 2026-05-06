import { useState, useEffect } from "react";
import { useToast } from "./useToast";

export type Course = {
  slug: string;
  title: string;
  description: string;
  exams: number;
  level: number;
  semester: number;
};

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const res = await fetch(`/api/courses`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCourses(data);
    } catch {
      setCourses([]);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const res = await fetch(`/api/courses`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (isMounted) setCourses(data);
      } catch {
        if (isMounted) setCourses([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const createCourse = async (form: Omit<Course, "exams">) => {
    const res = await fetch(`/api/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, exams: 0 }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to create course");
    }
    await fetchCourses();
    toast("Course saved successfully", true);
  };

  const updateCourse = async (
    slug: string,
    form: Pick<Course, "title" | "description" | "level" | "semester">,
  ) => {
    const res = await fetch(`/api/courses/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to update course");
    }
    await fetchCourses();
    toast("Course saved successfully", true);
  };

  const deleteCourse = async (course: Course) => {
    const res = await fetch(`/api/courses/${course.slug}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();
    setCourses((prev) => prev.filter((c) => c.slug !== course.slug));
    toast("Course deleted successfully", true);
  };

  return {
    courses,
    loading,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
