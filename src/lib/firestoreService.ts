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
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  read: boolean;
  createdAt?: Timestamp | null;
  targetAudience?: "all" | "specific";
  targetLevel?: string;
  targetSemester?: string;
  targetProgram?: string;
};

export type ScheduledNotification = {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  scheduledAt: Timestamp;
  createdBy: string;
  sent: boolean;
  sentAt?: Timestamp | null;
  targetAudience?: "all" | "specific";
  targetLevel?: string;
  targetSemester?: string;
  targetProgram?: string;
};

export async function createNotification(
  notification: Omit<Notification, "id" | "read" | "createdAt">,
) {
  await setDoc(doc(collection(db, "notifications")), {
    ...notification,
    read: false,
    createdAt: Timestamp.now(),
  });
}

export async function scheduleNotification(
  data: Omit<ScheduledNotification, "id" | "sent">,
) {
  await setDoc(doc(collection(db, "scheduledNotifications")), {
    ...data,
    sent: false,
  });
}

export async function markNotificationRead(notificationId: string) {
  await updateDoc(doc(db, "notifications", notificationId), { read: true });
}

export async function markAllNotificationsRead(ids: string[]) {
  await Promise.all(
    ids.map((id) => updateDoc(doc(db, "notifications", id), { read: true })),
  );
}

export async function deleteNotification(id: string) {
  await deleteDoc(doc(db, "notifications", id));
}

export async function deleteScheduledNotification(id: string) {
  await deleteDoc(doc(db, "scheduledNotifications", id));
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

export function listenToScheduledNotifications(
  callback: (items: ScheduledNotification[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, "scheduledNotifications"),
    orderBy("scheduledAt", "desc"),
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ScheduledNotification, "id">),
      })),
    );
  });
}
