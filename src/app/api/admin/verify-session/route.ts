import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { session } = await req.json();

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);

    if (!decoded.isAdmin) {
      return NextResponse.json({ error: "Not admin" }, { status: 403 });
    }

    return NextResponse.json({ uid: decoded.uid });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
