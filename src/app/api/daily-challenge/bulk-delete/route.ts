import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { scope, level } = body as {
      scope: "past" | "all" | "level";
      level?: number;
    };

    if (!scope || !["past", "all", "level"].includes(scope)) {
      return NextResponse.json(
        { error: "scope must be 'past', 'all', or 'level'" },
        { status: 400 },
      );
    }

    if (scope === "level" && !level) {
      return NextResponse.json(
        { error: "level is required when scope is 'level'" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const today = new Date().toISOString().split("T")[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (scope === "past") {
      query.date = { $lt: today };
    } else if (scope === "level") {
      query.targetLevel = Number(level);
      query.date = { $lt: today };
    }

    const challenges = await db
      .collection("daily_challenges")
      .find(query, { projection: { id: 1 } })
      .toArray();

    const challengeIds = challenges.map((c) => c.id);

    if (challengeIds.length === 0) {
      return NextResponse.json({ deletedChallenges: 0, deletedAttempts: 0 });
    }

    const attemptResult = await db
      .collection("daily_attempts")
      .deleteMany({ challengeId: { $in: challengeIds } });

    const challengeResult = await db
      .collection("daily_challenges")
      .deleteMany(query);

    return NextResponse.json({
      deletedChallenges: challengeResult.deletedCount,
      deletedAttempts: attemptResult.deletedCount,
    });
  } catch (error) {
    console.error("[DELETE /api/daily-challenge/bulk-delete]", error);
    return NextResponse.json(
      { error: "Bulk delete failed. Please try again." },
      { status: 500 },
    );
  }
}
