import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ExamResult } from "../dashboard/dashboard.types";
import { exams as mockExams, Exam } from "@/mock/exams";

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

// Swap for a REST API:

// export function useExam(id: string) {
//   const [exam, setExam] = useState<Exam | undefined>(undefined);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     let isMounted = true;

//     (async () => {
//       if (isMounted) setLoading(true);

//       try {
//         const res = await fetch(`${API_URL}/exams/${id}`);
//         const data = await res.json();

//         if (isMounted) setExam(data);
//       } catch {
//         if (isMounted) setExam(undefined);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, [id]);

//   return { exam, loading };
// }

// Using mock data for now

export function useExam(id: string) {
  const [exam, setExam] = useState<Exam | undefined>(undefined);
  const [loading, setLoading] = useState(() => !!id);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        await Promise.resolve();

        const result = mockExams.find((e) => e.id === id);

        if (!cancelled) setExam(result);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { exam, loading };
}

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
