import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import {
  DailyChallenge,
  DailyAttempt,
  ChallengeAnswer,
  UserStreak,
  scoreChallenge,
} from "@/mock/challenge";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, username, challengeId, answers, timeTaken } = body as {
      uid: string;
      username: string;
      challengeId: string;
      answers: Record<string, ChallengeAnswer>;
      timeTaken: number;
    };

    if (!uid || !username || !challengeId || !answers || timeTaken == null) {
      return NextResponse.json(
        {
          error:
            "uid, username, challengeId, answers, and timeTaken are required",
        },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const challenge = (await db
      .collection("daily_challenges")
      .findOne({ id: challengeId })) as DailyChallenge | null;

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 },
      );
    }

    const existing = await db
      .collection("daily_attempts")
      .findOne({ uid, challengeId });

    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted this challenge" },
        { status: 409 },
      );
    }

    const { score, correct, total } = scoreChallenge(challenge.items, answers);

    const today = challenge.date;
    const submittedAt = new Date().toISOString();

    const attempt: DailyAttempt = {
      id: nanoid(),
      uid,
      username,
      challengeId,
      date: today,
      level: challenge.targetLevel,
      score,
      correct,
      total,
      timeTaken,
      answers,
      submittedAt,
    };

    await db.collection("daily_attempts").insertOne(attempt);

    const streakDoc = (await db
      .collection("user_streaks")
      .findOne({ uid })) as UserStreak | null;

    let currentStreak = 1;
    let longestStreak = 1;

    if (streakDoc) {
      const last = streakDoc.lastChallengeDate;
      longestStreak = streakDoc.longestStreak;

      if (last) {
        const lastDate = new Date(last);
        const todayDate = new Date(today);
        const diffDays = Math.round(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          currentStreak = streakDoc.currentStreak + 1;
        } else if (diffDays === 0) {
          currentStreak = streakDoc.currentStreak;
        } else {
          currentStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, currentStreak);
    }

    await db.collection("user_streaks").updateOne(
      { uid },
      {
        $set: {
          uid,
          currentStreak,
          longestStreak,
          lastChallengeDate: today,
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      score,
      correct,
      total,
      timeTaken,
      currentStreak,
      longestStreak,
      attemptId: attempt.id,
    });
  } catch (error) {
    console.error("[POST /api/daily-challenge/submit]", error);
    return NextResponse.json(
      { error: "Failed to submit challenge" },
      { status: 500 },
    );
  }
}
