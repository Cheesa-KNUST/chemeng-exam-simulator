import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/context/userService";
import { useDashboardStore } from "@/store/dashboard.store";

import {
  getStats,
  getPerformanceData,
  getScoreDistribution,
  getActivityData,
  getTrends,
} from "@/helpers/dashboard/dashboard.transform";

export function useDashboardData() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const { data, loading, fetchDashboard, error } = useDashboardStore();

  useEffect(() => {
    if (!user) return;

    const unsub = getUserProfile(user.uid, setProfile);
    fetchDashboard(user.uid);

    return () => unsub();
  }, [user, fetchDashboard]);

  const username = profile?.username || "Student";

  const stats = useMemo(() => getStats(data), [data]);
  const performance = useMemo(() => getPerformanceData(data), [data]);
  const distribution = useMemo(() => getScoreDistribution(data), [data]);
  const activity = useMemo(() => getActivityData(data), [data]);
  const trends = useMemo(() => getTrends(data), [data]);

  return {
    user,
    username,
    data,
    loading,
    error,
    stats,
    performance,
    distribution,
    activity,
    trends,
  };
}
