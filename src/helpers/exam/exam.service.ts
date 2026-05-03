import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ExamResult } from "../dashboard/dashboard.types";
import { Exam } from "@/mock/exams";

export async function saveExamResult(
  data: Omit<ExamResult, "id" | "createdAt">,
) {
  const docRef = await addDoc(collection(db, "examResults"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function useExam(id: string) {
  const [exam, setExam] = useState<Exam | undefined>(undefined);
  const [loading, setLoading] = useState(() => !!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    (async () => {
      try {
        const res = await fetch(`/api/exams/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch exam");
        }

        const data = await res.json();

        if (isMounted) setExam(data);
      } catch (err) {
        if (isMounted) {
          setError("Failed to load exam");
          console.error(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { exam, loading, error };
}

export async function getExamsByCourseSlug(courseSlug: string) {
  const res = await fetch(`/api/exams?courseSlug=${courseSlug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch exams");
  }

  return await res.json();
}

export async function getExamById(id: string) {
  const res = await fetch(`/api/exams/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch exam");
  }

  return await res.json();
}
