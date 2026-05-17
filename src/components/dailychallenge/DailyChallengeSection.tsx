"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Trophy,
  Clock,
  X,
  Zap,
  CalendarClock,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { DailyChallengeResponse } from "@/mock/challenge";
import { useAuth } from "@/context/AuthContext";

function formatCountdown(targetISO: string): string {
  const diff = new Date(targetISO).getTime() - Date.now();
  if (diff <= 0) return "Available now";

  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);

  return `${h}h ${m}m ${s}s`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export default function DailyChallengeSection() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [state, setState] = useState<DailyChallengeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!user || !profile?.level) return;

    const level = Number(profile.level);
    if (isNaN(level)) return;

    fetch(`/api/daily-challenge?level=${level}&uid=${user.uid}`)
      .then((r) => r.json())
      .then((data: DailyChallengeResponse) => {
        setState(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, profile]);

  useEffect(() => {
    if (!state?.nextChallengeAt) return;

    const target = state.nextChallengeAt;
    const tick = () => setCountdown(formatCountdown(target));

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [state?.nextChallengeAt]);

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Syncing Workspace...
        </p>
      </div>
    );
  }

  if (!state || !profile?.level) return null;

  if (dismissed) {
    return (
      <div className="w-full mx-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-all duration-200 animate-in fade-in-50">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-slate-300 dark:text-slate-600" />
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Daily Challenge module collapsed
          </p>
        </div>
        <button
          onClick={() => setDismissed(false)}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <RotateCcw size={12} />
          Restore View
        </button>
      </div>
    );
  }

  if (state.status === "none") {
    if (!state.nextChallengeAt) return null;

    return (
      <div className="w-full mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 relative overflow-hidden transition-all border-t-4 border-t-slate-400 dark:border-t-slate-600">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg transition-colors"
          aria-label="Hide challenge card"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-500">
            <CalendarClock size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              No active assignment today
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              The engine is formulating your next curriculum benchmark
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/40 px-6 py-2.5 rounded-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Launches In
            </p>
            <p className="text-2xl font-black text-slate-700 dark:text-slate-300 tabular-nums tracking-tight">
              {countdown}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === "completed") {
    return (
      <div className="w-full mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 relative overflow-hidden transition-all border-t-4 border-t-emerald-500">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg transition-colors"
          aria-label="Hide card"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center space-y-5">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-xs">
              <Trophy size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Challenge Mastered!
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              You completed today&apos;s level evaluation metrics.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/30">
              <p className="text-xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                {state.attempt.score}%
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Accuracy
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/30">
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {state.attempt.correct}/{state.attempt.total}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Correct
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/30">
              <p className="text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                {formatTime(state.attempt.timeTaken)}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Duration
              </p>
            </div>
          </div>

          <div className="w-full pt-1">
            <Button
              variant="secondary"
              onClick={() =>
                router.push(
                  `/student/daily-challenge/${state.challenge.id}/results`,
                )
              }
              className="w-full bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:border-slate-700 dark:text-slate-200 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm shadow-xs transition-all"
            >
              <Trophy size={14} className="text-amber-500" />
              View Standings Leaderboard
            </Button>
          </div>

          {countdown && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Next rotation unlock in{" "}
              <span className="font-bold tabular-nums text-slate-600 dark:text-slate-300">
                {countdown}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white dark:bg-slate-900 border border-blue-200/70 dark:border-blue-900/40 rounded-2xl shadow-sm p-6 relative overflow-hidden transition-all border-t-4 border-t-orange-500 focus-within:ring-2 focus-within:ring-blue-500/10">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg transition-colors"
        aria-label="Collapse container"
      >
        <X size={16} />
      </button>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex flex-col items-center space-y-1">
          <div className="p-3 bg-orange-50 dark:bg-orange-950/40 rounded-2xl text-orange-600 dark:text-orange-400 shadow-xs animate-pulse">
            <Flame size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Daily Milestone Assessment
          </h2>
          <p className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-md mt-1">
            Tier Rank: Level {profile.level} · 24hr Window
          </p>
        </div>

        <div className="w-full border-y border-slate-100 dark:border-slate-800/80 py-3 my-1">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
            {state.challenge.title}
          </h3>
        </div>

        <div className="flex items-center justify-center gap-5 w-full text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            <span>{state.challenge.duration} Mins</span>
          </div>

          <div className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />

          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-slate-400" />
            <span>
              {
                state.challenge.items.filter((i) => i.kind !== "preamble")
                  .length
              }{" "}
              Scored Items
            </span>
          </div>

          <div className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />

          <div className="flex items-center gap-1.5">
            <Trophy size={14} className="text-slate-400" />
            <span>Competitive Pool</span>
          </div>
        </div>

        <div className="w-full pt-2 group">
          <Button
            variant="primary"
            onClick={() =>
              router.push(`/student/daily-challenge/${state.challenge.id}`)
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-xs shadow-blue-600/10 hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Flame size={15} />
            <span>Initialize Assessment Routine</span>
            <ArrowRight
              size={14}
              className="transform group-hover:translate-x-0.5 transition-transform"
            />
          </Button>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide mt-2">
            Warning: Execution pipeline terminates if connection drops.
            Singleton instance attempt.
          </p>
        </div>
      </div>
    </div>
  );
}
