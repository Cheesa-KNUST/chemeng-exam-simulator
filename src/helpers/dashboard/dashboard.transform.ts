import {
  ExamResult,
  PerformancePoint,
  DistributionPoint,
  ActivityPoint,
  DashboardStats,
} from "./dashboard.types";

export function getStats(data: ExamResult[]): DashboardStats {
  const total = data.length;

  const avg =
    total === 0
      ? 0
      : Math.round(data.reduce((acc, d) => acc + d.score, 0) / total);

  return {
    courses: new Set(data.map((d) => d.course)).size,
    completedExams: total,
    averageScore: avg,
  };
}

export function getPerformanceData(data: ExamResult[]): PerformancePoint[] {
  const grouped: Record<string, number[]> = {};

  data.forEach((d) => {
    if (!grouped[d.course]) grouped[d.course] = [];
    grouped[d.course].push(d.score);
  });

  return Object.entries(grouped).map(([course, scores]) => ({
    name: course,
    score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));
}

export function getScoreDistribution(data: ExamResult[]): DistributionPoint[] {
  const buckets = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
  };

  data.forEach((d) => {
    if (d.score >= 70) buckets.A++;
    else if (d.score >= 60) buckets.B++;
    else if (d.score >= 50) buckets.C++;
    else if (d.score >= 40) buckets.D++;
    else if (d.score >= 30) buckets.E++;
    else buckets.F++;
  });

  return Object.entries(buckets).map(([name, value]) => ({
    name,
    value,
  }));
}

export function getActivityData(data: ExamResult[]): ActivityPoint[] {
  const weeks: Record<string, number> = {};

  data.forEach((d) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = d.createdAt as any;
    const date = raw?.toDate ? raw.toDate() : new Date(raw);

    if (isNaN(date.getTime())) return;

    const weekNumber = Math.ceil(date.getDate() / 7);
    const week = `W${weekNumber}`;
    weeks[week] = (weeks[week] || 0) + 1;
  });

  return Object.entries(weeks).map(([week, exams]) => ({ week, exams }));
}

export function getTrends(data: ExamResult[]) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekExams = data.filter((d) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = d.createdAt as any;
    const date = raw?.toDate ? raw.toDate() : new Date(raw);
    return date >= startOfWeek;
  }).length;

  const sorted = [...data].sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aRaw = a.createdAt as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bRaw = b.createdAt as any;
    const aDate = aRaw?.toDate ? aRaw.toDate() : new Date(aRaw);
    const bDate = bRaw?.toDate ? bRaw.toDate() : new Date(bRaw);
    return bDate.getTime() - aDate.getTime();
  });

  const recent = sorted.slice(0, 3);
  const previous = sorted.slice(3, 6);

  const recentAvg =
    recent.length === 0
      ? 0
      : Math.round(recent.reduce((a, d) => a + d.score, 0) / recent.length);

  const prevAvg =
    previous.length === 0
      ? 0
      : Math.round(previous.reduce((a, d) => a + d.score, 0) / previous.length);

  const scoreDiff = recentAvg - prevAvg;

  return {
    weeklyExams: thisWeekExams,
    scoreDiff,
  };
}
