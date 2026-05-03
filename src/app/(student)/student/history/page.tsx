"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";

import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import { useAuth } from "@/context/AuthContext";

import {
  Trophy,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

import { getExamHistory, ExamHistoryEntry } from "@/context/userService";

import { getScoreTrend } from "@/helpers/dashboard/dashboard.transform";

function formatDate(value: unknown): string {
  if (!value) return "—";
  const ts = value as { toDate?: () => Date; seconds?: number };
  const date =
    typeof ts.toDate === "function"
      ? ts.toDate()
      : ts.seconds
        ? new Date(ts.seconds * 1000)
        : new Date(value as string);
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function gradeInfo(percent: number): {
  label: string;
  variant: "green" | "blue" | "yellow" | "red";
  color: string;
  bar: string;
} {
  if (percent >= 80)
    return {
      label: "Excellent",
      variant: "green",
      color: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500",
    };
  if (percent >= 60)
    return {
      label: "Good",
      variant: "blue",
      color: "text-blue-600 dark:text-blue-400",
      bar: "bg-blue-500",
    };
  if (percent >= 50)
    return {
      label: "Pass",
      variant: "yellow",
      color: "text-amber-600 dark:text-amber-400",
      bar: "bg-amber-400",
    };
  return {
    label: "Needs Work",
    variant: "red",
    color: "text-red-600 dark:text-red-400",
    bar: "bg-red-500",
  };
}

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
          {label}
        </p>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ExamHistoryPage() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [results, setResults] = useState<ExamHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!uid) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await getExamHistory(uid);
        if (!cancelled) setResults(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  const filteredResults = results.filter((r) =>
    r.course.toLowerCase().includes(query.toLowerCase()),
  );

  const totalExams = results.length;
  const avgScore =
    totalExams > 0
      ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / totalExams)
      : 0;
  const bestScore =
    totalExams > 0 ? Math.max(...results.map((r) => r.score)) : 0;
  const passCount = results.filter((r) => r.score >= 50).length;

  const trend = getScoreTrend(results);

  const TrendIcon =
    trend === null
      ? null
      : trend > 0
        ? TrendingUp
        : trend < 0
          ? TrendingDown
          : Minus;
  const trendColor =
    trend === null
      ? ""
      : trend > 0
        ? "text-emerald-500"
        : trend < 0
          ? "text-red-500"
          : "text-slate-400";

  if (!uid || loading) {
    return (
      <AppShell>
        <Loader fullPage size="lg" label="Loading your exam history…" />;
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Exam History" subtitle="All your past exam attempts" />

      {totalExams === 0 ? (
        <EmptyState
          icon={<ClipboardList size={22} />}
          title="No exams taken yet"
          description="You haven't completed any exams. Head to your courses to get started."
          action={
            <Link href="/student/courses">
              <Button variant="primary">Browse courses</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard
              label="Exams taken"
              value={totalExams}
              icon={<BookOpen size={18} />}
            />
            <StatCard
              label="Average score"
              value={`${avgScore}%`}
              sub={
                trend !== null
                  ? `${trend > 0 ? "+" : ""}${trend}% vs prev week`
                  : undefined
              }
              icon={
                TrendIcon ? (
                  <TrendIcon size={18} className={trendColor} />
                ) : (
                  <Trophy size={18} />
                )
              }
            />
            <StatCard
              label="Best score"
              value={`${bestScore}%`}
              icon={<Trophy size={18} />}
            />
            <StatCard
              label="Passed"
              value={`${passCount} / ${totalExams}`}
              sub="≥ 50% to pass"
              icon={<CheckCircle2 size={18} />}
            />
          </div>

          <Input
            placeholder="Search exams by course..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4"
          />

          {filteredResults.length === 0 ? (
            <EmptyState
              icon={<ClipboardList size={22} />}
              title="No matching exams"
              description="Try a different search term."
            />
          ) : (
            <div className="space-y-3">
              {filteredResults.map((result) => {
                const grade = gradeInfo(result.score);

                return (
                  <button
                    key={result.id}
                    className="w-full text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-slate-500 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {result.course}
                          </p>
                          <Badge text={grade.label} variant={grade.variant} />
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {formatDate(result.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen size={11} />
                            {result.total} question
                            {result.total !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${grade.bar}`}
                            style={{ width: `${result.score}%` }}
                          />
                        </div>

                        <div className="flex items-center gap-4 text-xs mt-1">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 size={11} />
                            {result.correct} correct
                          </span>
                          <span className="flex items-center gap-1 text-red-500 dark:text-red-400 font-medium">
                            <XCircle size={11} />
                            {result.total - result.correct} wrong
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-2xl font-bold ${grade.color}`}>
                          {result.score}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
