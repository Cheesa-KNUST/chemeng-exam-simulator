import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const client = await clientPromise;
    const db = client.db(dbName);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (level) query.targetLevel = Number(level);
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to) query.date.$lte = to;
    }

    const challenges = await db
      .collection("daily_challenges")
      .find(query)
      .sort({ date: -1 })
      .toArray();

    const today = new Date().toISOString().split("T")[0];

    const enriched = await Promise.all(
      challenges.map(async (c) => {
        const attemptCount = await db
          .collection("daily_attempts")
          .countDocuments({ challengeId: c.id });

        const status =
          c.date < today ? "past" : c.date === today ? "live" : "upcoming";

        return {
          ...c,
          _id: undefined,
          attemptCount,
          status,
        };
      }),
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("[GET /api/daily-challenge/admin]", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const today = new Date().toISOString().split("T")[0];

    const challenge = await db.collection("daily_challenges").findOne({ id });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 },
      );
    }

    if (challenge.date <= today) {
      return NextResponse.json(
        { error: "Cannot delete a live or past challenge" },
        { status: 403 },
      );
    }

    await db.collection("daily_challenges").deleteOne({ id });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/daily-challenge/admin]", error);
    return NextResponse.json(
      { error: "Failed to delete challenge" },
      { status: 500 },
    );
  }
}
