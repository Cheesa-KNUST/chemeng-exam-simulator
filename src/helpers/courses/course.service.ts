export async function getCourses() {
  const res = await fetch(`/api/courses`);

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
