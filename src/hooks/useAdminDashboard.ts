import { useEffect, useState, useRef, useCallback } from "react";
import { collection, query, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type DashboardData = {
  users: {
    total: number;
    byLevel: { level: string; count: number }[];
    recent: {
      username: string;
      level: string;
      program: string;
      createdAt: string | null;
    }[];
  };
  exams: {
    totalAttempts: number;
    avgScore: number;
    weeklyActivity: { day: string; count: number }[];
    scoreDistribution: { grade: string; count: number }[];
    totalExams: number;
  };
  courses: {
    total: number;
    topCourses: { course: string; count: number }[];
  };
  materials: {
    total: number;
    approved: number;
    pending: number;
    totalDownloads: number;
    byType: { type: string; count: number }[];
  };
};

function buildWeeklyActivity(
  results: { createdAt?: Timestamp | null }[],
): { day: string; count: number }[] {
  const now = Date.now();
  const dayMs = 86400000;
  const activityMap: Record<string, number> = {};

  for (let i = 6; i >= 0; i--) {
    const key = new Date(now - i * dayMs).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    activityMap[key] = 0;
  }

  results.forEach((r) => {
    const ts = r.createdAt?.toDate?.();
    if (!ts) return;
    if (now - ts.getTime() > 7 * dayMs) return;
    const key = ts.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    if (key in activityMap) activityMap[key]++;
  });

  return Object.entries(activityMap).map(([day, count]) => ({ day, count }));
}

function buildScoreDistribution(
  results: { score?: number }[],
): { grade: string; count: number }[] {
  const bands = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  results.forEach((r) => {
    const s = r.score ?? 0;
    if (s >= 80) bands.A++;
    else if (s >= 70) bands.B++;
    else if (s >= 60) bands.C++;
    else if (s >= 50) bands.D++;
    else bands.F++;
  });
  return Object.entries(bands).map(([grade, count]) => ({ grade, count }));
}

export function useAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const slices = useRef<{
    users: DashboardData["users"] | null;
    exams: Omit<DashboardData["exams"], "totalExams"> | null;
    materials: DashboardData["materials"] | null;
    mongo: {
      totalCourses: number;
      totalExams: number;
      topCourses: { course: string; count: number }[];
    } | null;
  }>({
    users: null,
    exams: null,
    materials: null,
    mongo: null,
  });

  const tryMerge = useCallback(() => {
    const { users, exams, materials, mongo } = slices.current;
    if (!users || !exams || !materials || !mongo) return;

    setData({
      users,
      exams: { ...exams, totalExams: mongo.totalExams },
      courses: { total: mongo.totalCourses, topCourses: mongo.topCourses },
      materials,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "users"));
    return onSnapshot(
      q,
      (snap) => {
        const users = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as {
          id: string;
          username?: string;
          level?: string;
          program?: string;
          createdAt?: Timestamp | null;
        }[];

        const sorted = [...users].sort((a, b) => {
          const at = a.createdAt?.toMillis?.() ?? 0;
          const bt = b.createdAt?.toMillis?.() ?? 0;
          return bt - at;
        });

        const byLevel = users.reduce<Record<string, number>>((acc, u) => {
          const lvl = u.level ? `Level ${u.level}` : "Unknown";
          acc[lvl] = (acc[lvl] ?? 0) + 1;
          return acc;
        }, {});

        const recent = sorted
          .filter((u) => u.createdAt)
          .slice(0, 5)
          .map((u) => ({
            username: u.username ?? "—",
            level: u.level ?? "—",
            program: u.program ?? "—",
            createdAt: u.createdAt?.toDate?.().toISOString() ?? null,
          }));

        slices.current.users = {
          total: users.length,
          byLevel: Object.entries(byLevel).map(([level, count]) => ({
            level,
            count,
          })),
          recent,
        };
        tryMerge();
      },
      () => setError("Failed to load user data."),
    );
  }, [tryMerge]);

  useEffect(() => {
    const q = query(collection(db, "examResults"));
    return onSnapshot(
      q,
      (snap) => {
        const results = snap.docs.map((d) => d.data()) as {
          score?: number;
          correct?: number;
          total?: number;
          userId?: string;
          createdAt?: Timestamp | null;
        }[];

        const totalAttempts = results.length;
        const avgScore =
          results.length > 0
            ? Math.round(
                results.reduce((acc, r) => acc + (r.score ?? 0), 0) /
                  results.length,
              )
            : 0;

        slices.current.exams = {
          totalAttempts,
          avgScore,
          weeklyActivity: buildWeeklyActivity(results),
          scoreDistribution: buildScoreDistribution(results),
        };
        tryMerge();
      },
      () => setError("Failed to load exam data."),
    );
  }, [tryMerge]);

  useEffect(() => {
    const q = query(collection(db, "materials"));
    return onSnapshot(
      q,
      (snap) => {
        const materials = snap.docs.map((d) => d.data()) as {
          status?: string;
          fileType?: string;
          downloadCount?: number;
        }[];

        const byType = materials.reduce<Record<string, number>>((acc, m) => {
          const t = m.fileType ?? "other";
          acc[t] = (acc[t] ?? 0) + 1;
          return acc;
        }, {});

        slices.current.materials = {
          total: materials.length,
          approved: materials.filter((m) => m.status === "approved").length,
          pending: materials.filter((m) => m.status === "pending").length,
          totalDownloads: materials.reduce(
            (acc, m) => acc + (m.downloadCount ?? 0),
            0,
          ),
          byType: Object.entries(byType).map(([type, count]) => ({
            type,
            count,
          })),
        };
        tryMerge();
      },
      () => setError("Failed to load materials data."),
    );
  }, [tryMerge]);

  useEffect(() => {
    fetch("/api/admin/dashboard/mongo")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        slices.current.mongo = d;
        tryMerge();
      })
      .catch(() => setError("Failed to load course data."));
  }, [tryMerge]);

  return { data, loading, error };
}
