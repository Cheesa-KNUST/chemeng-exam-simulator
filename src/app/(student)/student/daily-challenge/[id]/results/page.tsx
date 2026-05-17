"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LeaderboardResponse, UserStreak } from "@/mock/challenge";
import {
  Trophy,
  Flame,
  Clock,
  Users,
  Medal,
  CheckCircle2,
  Target,
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function RankBadge({
  rank,
  className = "",
}: {
  rank: number;
  className?: string;
}) {
  if (rank === 1)
    return (
      <Medal
        className={`text-amber-500 ${className}`}
        size={20}
        aria-label="1st Place"
      />
    );
  if (rank === 2)
    return (
      <Medal
        className={`text-slate-400 ${className}`}
        size={20}
        aria-label="2nd Place"
      />
    );
  if (rank === 3)
    return (
      <Medal
        className={`text-amber-700 ${className}`}
        size={20}
        aria-label="3rd Place"
      />
    );
  return (
    <span
      className={`text-sm font-semibold text-slate-400 dark:text-slate-500 ${className}`}
    >
      #{rank}
    </span>
  );
}

export default function ChallengeResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(
    null,
  );
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      fetch(
        `/api/daily-challenge/leaderboard?challengeId=${id}&uid=${user.uid}`,
      ).then((r) => r.json()),
      fetch(`/api/daily-challenge/streak?uid=${user.uid}`).then((r) =>
        r.json(),
      ),
    ])
      .then(([lb, st]) => {
        setLeaderboard(lb);
        setStreak(st);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, id]);

  if (loading) {
    return (
      <AppShell>
        <Loader label="Loading leaderboard..." size="lg" />
      </AppShell>
    );
  }

  const userEntry = leaderboard?.userEntry;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Daily Challenge Leaderboard" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userEntry && (
            <div
              className={`${streak && streak.currentStreak > 0 ? "md:col-span-2" : "md:col-span-3"} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Your Result
                    </h2>
                    <p className="text-xs text-slate-400">
                      Daily Challenge Completed
                    </p>
                  </div>
                </div>
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                  {userEntry.score}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3.5 flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-800/30">
                  <RankBadge rank={userEntry.rank} className="mb-1" />
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Rank
                  </p>
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3.5 flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-800/30">
                  <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1 font-bold">
                    <Clock size={16} />
                    <span className="text-sm sm:text-base tabular-nums">
                      {formatTime(userEntry.timeTaken)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Time
                  </p>
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3.5 flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-800/30">
                  <div className="text-purple-600 dark:text-purple-400 flex items-center gap-1 mb-1 font-bold">
                    <Users size={16} />
                    <span className="text-sm sm:text-base tabular-nums">
                      {leaderboard?.totalAttempts}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Participants
                  </p>
                </div>
              </div>
            </div>
          )}

          {streak && streak.currentStreak > 0 && (
            <div className="relative overflow-hidden bg-linear-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between border border-orange-400/20">
              <div className="flex items-start justify-between z-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-100">
                    Current Streak
                  </p>
                  <p className="text-5xl font-black mt-1 tracking-tight flex items-baseline gap-1 tabular-nums">
                    {streak.currentStreak}
                    <Flame
                      size={28}
                      className="fill-current text-amber-200 animate-pulse"
                    />
                  </p>
                </div>
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                  <Target size={20} className="text-amber-100" />
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 mt-4 text-xs font-medium text-orange-50/90 z-10">
                Personal Record:{" "}
                <span className="font-bold underline decoration-amber-300 decoration-2">
                  {streak.longestStreak} days
                </span>
              </div>
              <Flame
                size={120}
                className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none transform rotate-12 text-white"
              />
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <Trophy size={18} className="text-amber-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                Leaderboard Standings
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 tracking-wide">
              {leaderboard?.totalAttempts} Global Submissions
            </span>
          </div>

          {!leaderboard?.entries.length ? (
            <div className="text-center py-12 px-4 space-y-2">
              <Users
                size={32}
                className="mx-auto text-slate-300 dark:text-slate-700"
              />
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                No submission entries recorded yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-112.5 overflow-y-auto">
              {leaderboard.entries.map((entry) => {
                const isMe = entry.uid === user?.uid;
                return (
                  <div
                    key={entry.uid}
                    className={`flex items-center gap-4 px-6 py-3.5 transition-colors duration-150 ${
                      isMe
                        ? "bg-blue-50/70 dark:bg-blue-950/20 border-y border-blue-100/40 dark:border-blue-900/20"
                        : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="w-8 flex justify-center shrink-0">
                      <RankBadge rank={entry.rank} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold truncate ${isMe ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-700 dark:text-slate-200"}`}
                        >
                          {entry.username}
                        </p>
                        {isMe && (
                          <span className="text-[10px] font-black tracking-wider bg-blue-600 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        <Clock size={12} />
                        <span className="tabular-nums">
                          {formatTime(entry.timeTaken)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-sm font-extrabold tabular-nums tracking-tight ${
                        entry.rank === 1
                          ? "text-amber-500 dark:text-amber-400"
                          : entry.rank <= 3
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {entry.score}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
