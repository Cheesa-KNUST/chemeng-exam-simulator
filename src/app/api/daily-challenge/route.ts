import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import {
  DailyChallenge,
  DailyAttempt,
  DailyChallengeResponse,
} from "@/mock/challenge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const levelParam = searchParams.get("level");
    const uid = searchParams.get("uid");

    if (!levelParam || !uid) {
      return NextResponse.json(
        { error: "level and uid are required" },
        { status: 400 },
      );
    }

    const level = Number(levelParam);
    if (isNaN(level)) {
      return NextResponse.json(
        { error: "level must be a number" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const today = new Date().toISOString().split("T")[0];

    const challenge = (await db.collection("daily_challenges").findOne({
      targetLevel: level,
      date: today,
    })) as DailyChallenge | null;

    const next = await db.collection("daily_challenges").findOne(
      {
        targetLevel: level,
        date: { $gt: today },
      },
      {
        sort: { date: 1 },
      },
    );

    const nextChallengeAt = next ? `${next.date}T00:00:00.000Z` : null;

    if (!challenge) {
      const response: DailyChallengeResponse = {
        status: "none",
        nextChallengeAt,
      };

      return NextResponse.json(response);
    }

    const attempt = (await db
      .collection("daily_attempts")
      .findOne({ uid, challengeId: challenge.id })) as DailyAttempt | null;

    if (attempt) {
      const response: DailyChallengeResponse = {
        status: "completed",
        challenge,
        attemptedToday: true,
        attempt,
        nextChallengeAt,
      };
      return NextResponse.json(response);
    }

    const response: DailyChallengeResponse = {
      status: "available",
      challenge,
      attemptedToday: false,
      nextChallengeAt,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/daily-challenge]", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, courseSlug, targetLevel, date, duration, items, createdBy } =
      body;

    if (
      !title ||
      !courseSlug ||
      !targetLevel ||
      !date ||
      !items ||
      !createdBy
    ) {
      return NextResponse.json(
        {
          error:
            "title, courseSlug, targetLevel, date, items, and createdBy are required",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "items must be a non-empty array" },
        { status: 400 },
      );
    }

    const level = Number(targetLevel);
    if (isNaN(level) || ![100, 200, 300, 400].includes(level)) {
      return NextResponse.json(
        { error: "targetLevel must be 100, 200, 300, or 400" },
        { status: 400 },
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "date must be in YYYY-MM-DD format" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const existing = await db
      .collection("daily_challenges")
      .findOne({ targetLevel: level, date });

    if (existing) {
      return NextResponse.json(
        { error: `A challenge for Level ${level} on ${date} already exists` },
        { status: 409 },
      );
    }

    const id = `challenge-${level}-${date}`;

    const doc: DailyChallenge = {
      id,
      title,
      courseSlug,
      targetLevel: level,
      date,
      duration: Number(duration) || 15,
      items,
      createdAt: new Date().toISOString(),
      createdBy,
    };

    await db.collection("daily_challenges").insertOne(doc);

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/daily-challenge]", error);
    return NextResponse.json(
      { error: "Failed to create daily challenge" },
      { status: 500 },
    );
  }
}
