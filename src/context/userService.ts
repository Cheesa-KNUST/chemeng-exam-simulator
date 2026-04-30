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
};

export type UserSettings = {
  autoSubmit: boolean;
  showAnswers: boolean;
  shuffleQuestions: boolean;
  allowReview: boolean;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  read: boolean;
  createdAt?: Timestamp | null;
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
) {
  const ref = doc(db, "users", uid);

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }

    callback(snap.data() as UserProfile);
  });
}

export function listenToNotifications(
  callback: (notifications: Notification[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, "notifications"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const data: Notification[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Notification, "id">),
    }));

    callback(data);
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
        autoSubmit: true,
        showAnswers: true,
        shuffleQuestions: false,
        allowReview: true,
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
}
