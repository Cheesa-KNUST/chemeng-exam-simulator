import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ExamResult } from "../dashboard/dashboard.types";

export async function saveExamResult(
  data: Omit<ExamResult, "id" | "createdAt">,
) {
  const docRef = await addDoc(collection(db, "examResults"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
