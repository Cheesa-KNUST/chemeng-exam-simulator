import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import { LeaderboardEntry, LeaderboardResponse } from "@/mock/challenge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get("challengeId");
    const uid = searchParams.get("uid");

    if (!challengeId) {
      return NextResponse.json(
        { error: "challengeId is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const challenge = await db
      .collection("daily_challenges")
      .findOne({ id: challengeId });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 },
      );
    }

    const attempts = await db
      .collection("daily_attempts")
      .find({ challengeId })
      .sort({ score: -1, timeTaken: 1 })
      .toArray();

    const entries: LeaderboardEntry[] = attempts.map((a, i) => ({
      rank: i + 1,
      uid: a.uid,
      username: a.username,
      score: a.score,
      timeTaken: a.timeTaken,
      submittedAt: a.submittedAt,
    }));

    const userEntry = uid ? (entries.find((e) => e.uid === uid) ?? null) : null;

    const response: LeaderboardResponse = {
      challengeId,
      date: challenge.date,
      entries: entries.slice(0, 20),
      totalAttempts: attempts.length,
      userEntry,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/daily-challenge/leaderboard]", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
