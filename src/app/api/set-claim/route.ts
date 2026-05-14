import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
    if (!uid)
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });

    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists || userDoc.data()?.isAdmin !== true) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await getAuth(getApps()[0]).setCustomUserClaims(uid, { isAdmin: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[set-claim]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
