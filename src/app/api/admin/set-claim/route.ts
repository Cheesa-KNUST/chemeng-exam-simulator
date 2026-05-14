import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { uid } = await req.json();
  const userDoc = await adminDb.collection("users").doc(uid).get();
  if (!userDoc.exists || userDoc.data()?.isAdmin !== true) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  await adminAuth.setCustomUserClaims(uid, { isAdmin: true });
  return NextResponse.json({ success: true });
}
