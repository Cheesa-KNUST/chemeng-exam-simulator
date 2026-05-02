import StatCard from "@/components/ui/StatCard";
import { BookOpen, ClipboardCheck, BarChart3 } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StatsSection({ loading, stats, trends }: any) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      <StatCard
        title="Attempted Courses"
        value={stats.courses}
        accent="bg-blue-500"
        trend={{
          value: stats.courses > 0 ? `${stats.courses} total` : "None yet",
          positive: stats.courses > 0 ? true : null,
        }}
        icon={<BookOpen size={20} strokeWidth={1.8} />}
      />

      <StatCard
        title="Completed Exams"
        value={stats.completedExams}
        accent="bg-emerald-500"
        trend={{
          value:
            trends.examDiff === 0
              ? "No change"
              : `${trends.examDiff > 0 ? "+" : ""}${trends.examDiff} [This week (${trends.weeklyExams}) vs Last week (${trends.prevExams})]`,
          positive: trends.examDiff === 0 ? null : trends.examDiff > 0,
        }}
        icon={<ClipboardCheck size={20} strokeWidth={1.8} />}
      />

      <StatCard
        title="Average Score"
        value={`${stats.averageScore}%`}
        accent="bg-amber-400"
        trend={{
          value:
            trends.scoreDiff === 0
              ? "No change"
              : `${trends.scoreDiff > 0 ? "+" : ""}${trends.scoreDiff}% vs prev`,
          positive: trends.scoreDiff === 0 ? null : trends.scoreDiff > 0,
        }}
        icon={<BarChart3 size={20} strokeWidth={1.8} />}
      />
    </div>
  );
}
