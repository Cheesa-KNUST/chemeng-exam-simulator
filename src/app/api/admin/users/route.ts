import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const [usersSnap, resultsSnap] = await Promise.all([
      adminDb.collection("users").orderBy("createdAt", "desc").get(),
      adminDb.collection("examResults").get(),
    ]);

    const statsByUser: Record<string, { count: number; totalScore: number }> =
      {};

    resultsSnap.docs.forEach((d) => {
      const { userId, score } = d.data();
      if (!userId) return;
      if (!statsByUser[userId])
        statsByUser[userId] = { count: 0, totalScore: 0 };
      statsByUser[userId].count++;
      statsByUser[userId].totalScore += score ?? 0;
    });

    const users = usersSnap.docs.map((d) => {
      const data = d.data();
      const stats = statsByUser[d.id];
      return {
        uid: d.id,
        username: data.username ?? "—",
        email: data.email ?? "—",
        level: data.level ?? "—",
        isAdmin: data.isAdmin === true,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
        examCount: stats?.count ?? 0,
        avgScore:
          stats && stats.count > 0
            ? Math.round(stats.totalScore / stats.count)
            : null,
      };
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("[admin/users]", err);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 },
    );
  }
}
