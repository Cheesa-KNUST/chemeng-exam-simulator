import { adminDb } from "@/lib/firebaseAdmin";

export async function getDashboardData(userId: string) {
  const snapshot = await adminDb
    .collection("examResults")
    .where("userId", "==", userId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
