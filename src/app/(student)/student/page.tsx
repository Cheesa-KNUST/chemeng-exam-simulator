"use client";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import Link from "next/link";

import { ArrowRight, Sparkles } from "lucide-react";

import { useDashboardData } from "@/app/(student)/features/useDashboardData";

import StatsSection from "../features/StatsSection";
import RecentExamsSection from "../features/RecentExamsSection";

import PerformanceChart from "@/components/charts/PerformanceChart";
import ScoreDistributionChart from "@/components/charts/ScoreDistributionChart";
import ActivityChart from "@/components/charts/ActivityChart";

import Skeleton from "@/components/ui/Skeleton";
import DailyChallengeSection from "@/components/dailychallenge/DailyChallengeSection";

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
            <Button variant="primary">Start Practice</Button>
          </Link>
        }
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm font-medium mt-4 mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <DailyChallengeSection />
      </div>

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
        description="Detailed analysis of your strengths and areas for improvement"
        action={
          <Link href="/student/history">
            <Button variant="primary">
              <ArrowRight size={18} />
            </Button>
          </Link>
        }
      />

      {loading ? (
        <Skeleton className="h-72 mb-6" />
      ) : (
        <RecentExamsSection data={data} />
      )}

      <Link
        href="/student/jude"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-200 group"
      >
        <Sparkles size={18} />
        <span className="text-sm font-medium max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Ask JudeAI
        </span>
      </Link>
    </AppShell>
  );
}
