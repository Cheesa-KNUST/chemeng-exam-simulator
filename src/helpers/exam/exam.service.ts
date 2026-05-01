import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ExamResult } from "../dashboard/dashboard.types";
import { exams as mockExams } from "@/mock/exams";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function saveExamResult(
  data: Omit<ExamResult, "id" | "createdAt">,
) {
  const docRef = await addDoc(collection(db, "examResults"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// I haven't used them yet. This is to replace the mock data in exam, results, and review pages
// This will let me not use the mock data when I amready to connect to the backend
export async function getExamsByCourseSlug(courseSlug: string) {
  try {
    const res = await fetch(`${API_URL}/exams?courseSlug=${courseSlug}`);
    if (!res.ok) throw new Error("Failed");

    return await res.json();
  } catch {
    return mockExams.filter((e) => e.courseSlug === courseSlug);
  }
}

export async function getExamById(id: string) {
  try {
    const res = await fetch(`${API_URL}/exams/${id}`);
    if (!res.ok) throw new Error("Failed");

    return await res.json();
  } catch {
    return mockExams.find((e) => e.id === id);
  }
}
