import {
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
  updateDoc,
  Timestamp,
  where,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type UserProfile = {
  uid: string;
  email: string | null;
  username: string;
  level?: string;
  program?: string;
  semester?: string;
  isAdmin?: boolean;
};

export type UserSettings = {
  notifications: boolean;
  showAnswers: boolean;
  shuffleQuestions: boolean;
  allowReview: boolean;
  saveChats: boolean;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  read: boolean;
  createdAt?: Timestamp | null;
  targetAudience: "all" | "specific";
  targetLevel?: string;
  targetSemester?: string;
  targetProgram?: string;
};

export type ExamHistoryEntry = {
  id: string;
  userId: string;
  examId: string;
  course: string;
  score: number;
  correct: number;
  total: number;
  resultId?: string;
  createdAt: Timestamp | null;
};

export async function upsertUserProfile(user: UserProfile) {
  await setDoc(
    doc(db, "users", user.uid),
    {
      ...user,
    },
    { merge: true },
  );
}

export function getUserProfile(
  uid: string,
  callback: (data: UserProfile | null) => void,
): Unsubscribe {
  if (!uid) {
    return () => {};
  }

  const ref = doc(db, "users", uid);

  const unsubscribe = onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }

      callback(snap.data() as UserProfile);
    },
    (error) => {
      console.warn("User profile listener error:", error);
      callback(null);
    },
  );

  return unsubscribe;
}

export function listenToNotifications(
  callback: (notifications: Notification[]) => void,
  profile?: UserProfile | null,
): Unsubscribe {
  const q = query(
    collection(db, "notifications"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const all: Notification[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Notification, "id">),
    }));

    const filtered = all.filter((n) => {
      if (!n.targetAudience || n.targetAudience === "all") return true;
      if (!profile) return false;

      const levelMatch = !n.targetLevel || profile.level === n.targetLevel;
      const semesterMatch =
        !n.targetSemester || profile.semester === n.targetSemester;
      const programMatch =
        !n.targetProgram || profile.program === n.targetProgram;

      return levelMatch && semesterMatch && programMatch;
    });

    callback(filtered);
  });
}

export async function updateUserSettings(
  uid: string,
  settings: Partial<UserSettings>,
) {
  await updateDoc(doc(db, "users", uid), {
    settings,
  });
}

export function listenToUserSettings(
  uid: string,
  callback: (settings: UserSettings) => void,
): Unsubscribe {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    const data = snap.data();

    callback(
      (data?.settings as UserSettings) ?? {
        notifications: true,
        showAnswers: true,
        shuffleQuestions: true,
        allowReview: true,
        saveChats: true,
      },
    );
  });
}

export async function resetUserExams(userId: string) {
  if (!userId) throw new Error("Missing userId");

  const q = query(collection(db, "examResults"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const deletes = snapshot.docs.map((d) =>
    deleteDoc(doc(db, "examResults", d.id)),
  );
  await Promise.all(deletes);

  const res = await fetch(`/api/results?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("[resetUserExams] MongoDB delete failed:", res.status, body);
    throw new Error("Failed to delete results from MongoDB");
  }

  const { deleted } = await res.json();
  console.log(
    `[resetUserExams] Deleted ${deleted} MongoDB result(s) for user ${userId}`,
  );
}

export async function getExamHistory(uid: string): Promise<ExamHistoryEntry[]> {
  const q = query(
    collection(db, "examResults"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ExamHistoryEntry, "id">),
  }));
}
