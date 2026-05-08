import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Timestamp.now();

  const snapshot = await db
    .collection("scheduledNotifications")
    .where("sent", "==", false)
    .where("scheduledAt", "<=", now)
    .get();

  if (snapshot.empty) {
    return NextResponse.json({ sent: 0 });
  }

  const batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    const notifRef = db.collection("notifications").doc();
    batch.set(notifRef, {
      title: data.title,
      message: data.message,
      type: data.type ?? "info",
      targetAudience: data.targetAudience ?? "all",
      targetLevel: data.targetLevel ?? null,
      targetSemester: data.targetSemester ?? null,
      targetProgram: data.targetProgram ?? null,
      createdAt: now,
      createdBy: data.createdBy ?? "system",
    });

    batch.update(doc.ref, { sent: true, sentAt: now });
    count++;
  }

  await batch.commit();

  return NextResponse.json({ sent: count });
}
