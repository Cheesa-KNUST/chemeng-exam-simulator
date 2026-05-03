import {
  ExamResult,
  PerformancePoint,
  DistributionPoint,
  ActivityPoint,
  DashboardStats,
} from "./dashboard.types";

import { ExamHistoryEntry } from "@/context/userService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDate(raw: any): Date {
  if (raw?.toDate) return raw.toDate();
  if (raw?._seconds) return new Date(raw._seconds * 1000);
  return new Date(raw);
}

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
  const days: Record<string, number> = {};

  data.forEach((d) => {
    const date = getDate(d.createdAt);

    if (isNaN(date.getTime())) return;

    const key = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    days[key] = (days[key] || 0) + 1;
  });

  return Object.entries(days)
    .map(([week, exams]) => ({ week, exams }))
    .sort((a, b) => {
      return new Date(a.week).getTime() - new Date(b.week).getTime();
    });
}

export function getTrends(data: ExamResult[]) {
  const now = new Date();

  const last7Days = new Date(now);
  last7Days.setDate(now.getDate() - 7);

  const prev14Days = new Date(now);
  prev14Days.setDate(now.getDate() - 14);

  const lastPeriod = data.filter((d) => {
    const date = getDate(d.createdAt);
    return date >= last7Days;
  });

  const prevPeriod = data.filter((d) => {
    const date = getDate(d.createdAt);
    return date >= prev14Days && date < last7Days;
  });

  const weeklyExams = lastPeriod.length;

  const prevExams = prevPeriod.length;

  const examDiff = weeklyExams - prevExams;

  const lastScores = lastPeriod.map((d) => d.score);
  const prevScores = prevPeriod.map((d) => d.score);

  const lastAvg =
    lastScores.length === 0
      ? 0
      : Math.round(lastScores.reduce((a, b) => a + b, 0) / lastScores.length);

  const prevAvg =
    prevScores.length === 0
      ? 0
      : Math.round(prevScores.reduce((a, b) => a + b, 0) / prevScores.length);

  const scoreDiff = lastAvg - prevAvg;

  return {
    weeklyExams,
    examDiff,
    scoreDiff,
    prevExams,
  };
}

export function getScoreTrend(results: ExamHistoryEntry[]): number | null {
  if (!results.length) return null;

  const now = new Date();

  const last7Days = new Date(now);
  last7Days.setDate(now.getDate() - 7);

  const prev14Days = new Date(now);
  prev14Days.setDate(now.getDate() - 14);

  const toDate = (ts: ExamHistoryEntry["createdAt"]): Date | null => {
    if (!ts) return null;
    return ts.toDate();
  };

  const lastPeriod = results.filter((r) => {
    const date = toDate(r.createdAt);
    return date && date >= last7Days;
  });

  const prevPeriod = results.filter((r) => {
    const date = toDate(r.createdAt);
    return date && date >= prev14Days && date < last7Days;
  });

  const avg = (arr: number[]) =>
    arr.length === 0
      ? 0
      : Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

  const lastAvg = avg(lastPeriod.map((r) => r.score));
  const prevAvg = avg(prevPeriod.map((r) => r.score));

  return lastAvg - prevAvg;
}
