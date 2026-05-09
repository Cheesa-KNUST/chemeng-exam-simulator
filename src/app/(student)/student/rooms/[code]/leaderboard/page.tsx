"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

import { useAuth } from "@/context/AuthContext";
import {
  LeaderboardEntry,
  LeaderboardResponse,
} from "@/helpers/rooms/room.service";

import {
  Trophy,
  Clock,
  Medal,
  Users,
  RotateCcw,
  CheckCircle2,
  Loader2,
  DoorOpen,
} from "lucide-react";

export default function LeaderboardPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;

  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/rooms/${code}/leaderboard?userId=${uid ?? ""}`,
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to load leaderboard");
      setData(body);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [code, uid]);

  useEffect(() => {
    if (!uid) return;
    fetchLeaderboard();
  }, [uid, fetchLeaderboard]);

  useEffect(() => {
    if (!data) return;
    if (data.completedCount >= data.totalParticipants) return;

    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [data, fetchLeaderboard]);

  if (loading)
    return <Loader fullPage size="lg" label="Loading leaderboard..." />;

  if (error || !data) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {error || "Leaderboard not available"}
            </p>
            <Link href={`/student/rooms/${code}`}>
              <Button variant="secondary">Back to lobby</Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const { entries, currentUserRank, totalParticipants, completedCount } = data;
  const allDone = completedCount >= totalParticipants;

  return (
    <AppShell>
      <PageHeader
        title="Leaderboard"
        subtitle={`${completedCount} of ${totalParticipants} completed`}
        action={
          <div className="flex items-center gap-2">
            {!allDone && (
              <button
                onClick={fetchLeaderboard}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Refresh"
              >
                <RotateCcw size={15} />
              </button>
            )}
            <Button
              variant="secondary"
              onClick={() => router.push(`/student/rooms/${code}`)}
              className="bg-slate-300"
            >
              <span className="flex items-center gap-2">
                <DoorOpen size={15} />
                Lobby
              </span>
            </Button>
          </div>
        }
      />

      {currentUserRank && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-5 py-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <Trophy size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                Your rank
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {currentUserRank} of {totalParticipants}
              </p>
            </div>
          </div>
          <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            #{currentUserRank}
          </span>
        </div>
      )}

      {!allDone && (
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-4">
          <Loader2 size={13} className="animate-spin" />
          Waiting for {totalParticipants - completedCount} participant
          {totalParticipants - completedCount !== 1 ? "s" : ""} to finish ·
          updates every 10s
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2rem_1fr_5rem_5rem] gap-3 px-5 py-3 border-b border-slate-100 dark:border-slate-700 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <span>#</span>
          <span>Participant</span>
          <span className="text-right">Score</span>
          <span className="text-right">Time</span>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400 dark:text-slate-500">
            <Users size={22} />
            <p className="text-sm">No participants yet</p>
          </div>
        ) : (
          entries.map((entry) => (
            <LeaderboardRow key={entry.userId} entry={entry} />
          ))
        )}
      </div>
    </AppShell>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const { rank, displayName, score, durationSeconds, status, isCurrentUser } =
    entry;

  const isCompleted = status === "completed";

  const rankDisplay = () => {
    if (rank === 1) return <Medal size={18} className="text-amber-400" />;
    if (rank === 2) return <Medal size={18} className="text-slate-400" />;
    if (rank === 3) return <Medal size={18} className="text-amber-600" />;
    return (
      <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
        {rank}
      </span>
    );
  };

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const scoreColor =
    score === null
      ? "text-slate-400 dark:text-slate-500"
      : score >= 80
        ? "text-emerald-600 dark:text-emerald-400"
        : score >= 60
          ? "text-blue-600 dark:text-blue-400"
          : score >= 50
            ? "text-amber-600 dark:text-amber-400"
            : "text-red-500 dark:text-red-400";

  return (
    <div
      className={`grid grid-cols-[2rem_1fr_5rem_5rem] gap-3 items-center px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors ${
        isCurrentUser
          ? "bg-blue-50/60 dark:bg-blue-900/10"
          : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
      }`}
    >
      <div className="flex items-center justify-center w-6">
        {rankDisplay()}
      </div>

      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate flex items-center gap-1.5">
            {displayName}
            {isCurrentUser && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                You
              </span>
            )}
          </p>
          {!isCompleted && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
              {status === "in_progress" ? (
                <>
                  <Loader2 size={10} className="animate-spin" />
                  In progress
                </>
              ) : (
                <>
                  <Clock size={10} />
                  Joined
                </>
              )}
            </p>
          )}
          {isCompleted && (
            <p className="text-[11px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={10} />
              Completed
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <span className={`text-sm font-bold ${scoreColor}`}>
          {score !== null ? `${score}%` : "—"}
        </span>
      </div>

      <div className="text-right">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {isCompleted ? formatDuration(durationSeconds) : "—"}
        </span>
      </div>
    </div>
  );
}
