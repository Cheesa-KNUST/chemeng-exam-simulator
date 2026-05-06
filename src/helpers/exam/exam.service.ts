import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ExamResult } from "../dashboard/dashboard.types";
import { Exam, ExamQuestion } from "@/mock/exams";

export type SaveExamResultPayload = Omit<ExamResult, "id" | "createdAt"> & {
  questions: ExamQuestion[];
  answers: Record<number, string>;
};

export async function saveExamResult(
  data: SaveExamResultPayload,
): Promise<string> {
  const { userId, examId, course, score, total, correct, questions, answers } =
    data;

  const mongoRes = await fetch("/api/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      examId,
      course,
      score,
      total,
      correct,
      questions,
      answers,
    }),
  });

  if (!mongoRes.ok) {
    throw new Error("Failed to save result snapshot to MongoDB");
  }

  const { resultId } = await mongoRes.json();

  const docRef = await addDoc(collection(db, "examResults"), {
    userId,
    examId,
    course,
    score,
    total,
    correct,
    resultId,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "examResults", docRef.id), { firebaseId: docRef.id });

  return resultId;
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

export async function getResultById(resultId: string) {
  const res = await fetch(`/api/results/${resultId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch result");
  }

  return await res.json();
}
