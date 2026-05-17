import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import { UserStreak } from "@/mock/challenge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const streak = (await db
      .collection("user_streaks")
      .findOne({ uid })) as UserStreak | null;

    return NextResponse.json(
      streak ?? {
        uid,
        currentStreak: 0,
        longestStreak: 0,
        lastChallengeDate: null,
      },
    );
  } catch (error) {
    console.error("[GET /api/daily-challenge/streak]", error);
    return NextResponse.json(
      { error: "Failed to fetch streak" },
      { status: 500 },
    );
  }
}
