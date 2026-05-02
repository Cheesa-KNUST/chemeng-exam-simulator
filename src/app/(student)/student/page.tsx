"use client";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import Link from "next/link";

import { useDashboardData } from "@/app/(student)/features/useDashboardData";

import StatsSection from "@/app/(student)/features/StatsSection";
import RecentExamsSection from "@/app/(student)/features/RecentExamsSection";

import PerformanceChart from "@/components/charts/PerformanceChart";
import ScoreDistributionChart from "@/components/charts/ScoreDistributionChart";
import ActivityChart from "@/components/charts/ActivityChart";

import Skeleton from "@/components/ui/Skeleton";

export default function HomePage() {
  const {
    username,
    loading,
    error,
    stats,
    performance,
    distribution,
    activity,
    trends,
    data,
  } = useDashboardData();

  const welcomeName = username?.split(" ")[0] || "Chemineer";

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${welcomeName}. Here's your progress overview.`}
        action={
          <Link href="/student/courses">
            <Button>Start Practice</Button>
          </Link>
        }
      />

      <SectionTitle
        title="Performance Health"
        description="Core indicators of your academic progress and consistency"
      />

      <StatsSection loading={loading} stats={stats} trends={trends} />

      <SectionTitle
        title="Performance Insights"
        description="How your scores are trending across recent assessments"
      />

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <PerformanceChart data={performance} />
          <ScoreDistributionChart data={distribution} />
        </div>
      )}

      <SectionTitle
        title="Study Activity"
        description="Your daily engagement and exam participation patterns"
      />

      {loading ? (
        <Skeleton className="h-72 mb-6" />
      ) : (
        <div className="mb-6">
          <ActivityChart data={activity} />
        </div>
      )}

      <SectionTitle
        title="Performance Breakdown"
        description="Detailed analysis of your strengths and areas for improvement (Last 6)"
      />

      {loading ? (
        <Skeleton className="h-72 mb-6" />
      ) : (
        <RecentExamsSection data={data} />
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm font-medium mt-4">
          {error}
        </div>
      )}
    </AppShell>
  );
}
