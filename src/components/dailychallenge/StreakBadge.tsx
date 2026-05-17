"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserStreak } from "@/mock/challenge";

export default function StreakBadge() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<UserStreak | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/daily-challenge/streak?uid=${user.uid}`)
      .then((r) => r.json())
      .then(setStreak)
      .catch(() => {});
  }, [user]);

  if (!streak || streak.currentStreak === 0) return null;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
      title={`Longest streak: ${streak.longestStreak} ${streak.longestStreak > 1 ? "days" : "day"}`}
    >
      <Flame size={13} className="text-orange-500" />
      <span className="text-xs font-bold text-orange-600 dark:text-orange-400 tabular-nums">
        {streak.currentStreak}
      </span>
    </div>
  );
}
