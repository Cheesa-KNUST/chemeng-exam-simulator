"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

import { BookOpen, ClipboardCheck, BarChart3 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/context/userService";

export default function HomePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsub = getUserProfile(user.uid, setProfile);
    return () => unsub();
  }, [user]);

  const username = profile?.username || "Student";

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${username}. Here's your progress overview.`}
        action={
          <Link href="/student/courses">
            <Button>Start Practice</Button>
          </Link>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard
          title="Available Courses"
          value="8"
          accent="bg-blue-500"
          trend={{ value: "+2", positive: true }}
          icon={<BookOpen size={20} strokeWidth={1.8} />}
        />

        <StatCard
          title="Completed Exams"
          value="14"
          accent="bg-emerald-500"
          trend={{ value: "3 this week", positive: true }}
          icon={<ClipboardCheck size={20} strokeWidth={1.8} />}
        />

        <StatCard
          title="Average Score"
          value="72%"
          accent="bg-amber-400"
          trend={{ value: "5%", positive: false }}
          icon={<BarChart3 size={20} strokeWidth={1.8} />}
        />
      </div>

      <SectionTitle
        title="Recent Activity"
        description="Your last exam attempts and scores"
      />
    </AppShell>
  );
}
