"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import {
  PlusCircle,
  Flame,
  CalendarDays,
  Clock,
  Users,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

type ChallengeRow = {
  id: string;
  title: string;
  courseSlug: string;
  targetLevel: number;
  date: string;
  duration: number;
  status: "live" | "upcoming" | "past";
  attemptCount: number;
  items: { kind: string }[];
};

type BulkScope = "past" | "all" | "level";

const STATUS_STYLES = {
  live: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  upcoming:
    "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  past: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const STATUS_ICONS = {
  live: <Flame size={11} />,
  upcoming: <CalendarDays size={11} />,
  past: <CheckCircle size={11} />,
};

export default function DailyChallengeAdminPage() {
  const [challenges, setChallenges] = useState<ChallengeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | "all">("all");

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkScope, setBulkScope] = useState<BulkScope>("past");
  const [bulkLevel, setBulkLevel] = useState<number>(100);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const url =
          filterLevel === "all"
            ? "/api/daily-challenge/admin"
            : `/api/daily-challenge/admin?level=${filterLevel}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) setChallenges(data);
      } catch {
        if (!cancelled) setChallenges([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [filterLevel]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this scheduled challenge? This cannot be undone."))
      return;
    setDeleting(id);
    try {
      await fetch(`/api/daily-challenge/admin?id=${id}`, { method: "DELETE" });
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete challenge.");
    } finally {
      setDeleting(null);
    }
  }, []);

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    setBulkResult(null);
    try {
      const res = await fetch("/api/daily-challenge/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: bulkScope,
          level: bulkScope === "level" ? bulkLevel : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBulkResult(
        `Deleted ${data.deletedChallenges} challenge${data.deletedChallenges !== 1 ? "s" : ""} and ${data.deletedAttempts} attempt${data.deletedAttempts !== 1 ? "s" : ""}.`,
      );
      const listRes = await fetch(
        filterLevel === "all"
          ? "/api/daily-challenge/admin"
          : `/api/daily-challenge/admin?level=${filterLevel}`,
      );
      setChallenges(await listRes.json());
    } catch (e) {
      setBulkResult(`Error: ${e instanceof Error ? e.message : "Failed"}`);
    } finally {
      setBulkDeleting(false);
    }
  };

  const scoredCount = (c: ChallengeRow) =>
    c.items.filter((i) => i.kind !== "preamble").length;

  return (
    <AppShell>
      <PageHeader
        title="Daily Challenges"
        subtitle="Manage timed challenges for each level"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setShowBulkModal(true)}>
              <span className="flex items-center gap-1.5">
                <Trash2 size={14} />
                Clean Up
              </span>
            </Button>
            <Link href="/admin/daily-challenge/new">
              <Button variant="primary">
                <span className="flex items-center gap-2">
                  <PlusCircle size={15} />
                  New Challenge
                </span>
              </Button>
            </Link>
          </div>
        }
      />

      <div className="flex gap-2 mb-6">
        {(["all", 100, 200, 300, 400] as const).map((l) => (
          <button
            key={l}
            onClick={() => setFilterLevel(l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
              filterLevel === l
                ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            {l === "all" ? "All Levels" : `Level ${l}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <EmptyState
          icon={<Flame size={24} />}
          title="No daily challenges yet"
          description="Create your first timed challenge for students."
          action={
            <Link href="/admin/daily-challenge/new">
              <Button variant="primary">
                <span className="flex items-center gap-2">
                  <PlusCircle size={15} />
                  Create Challenge
                </span>
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4"
            >
              <span
                className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border shrink-0 ${STATUS_STYLES[c.status]}`}
              >
                {STATUS_ICONS[c.status]}
                {c.status}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {c.title}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                  <span>Level {c.targetLevel}</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={11} /> {c.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {c.duration}m
                  </span>
                  <span>{scoredCount(c)} questions</span>
                  <span className="flex items-center gap-1">
                    <Users size={11} /> {c.attemptCount} attempts
                  </span>
                </div>
              </div>

              {c.status === "upcoming" && (
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deleting === c.id}
                  className="text-slate-400 hover:text-red-500 transition shrink-0"
                  title="Delete challenge"
                >
                  {deleting === c.id ? (
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin block" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showBulkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowBulkModal(false)
          }
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Clean Up Challenges
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Permanently deletes challenges and all their attempt data from
                  MongoDB.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                What to delete
              </label>
              <div className="space-y-2">
                {(
                  [
                    {
                      value: "past",
                      label: "All past challenges",
                      desc: "Challenges before today (all levels)",
                    },
                    {
                      value: "level",
                      label: "Past challenges for a specific level",
                      desc: "Select a level below",
                    },
                    {
                      value: "all",
                      label: "Everything",
                      desc: "All challenges past, present and future",
                    },
                  ] as { value: BulkScope; label: string; desc: string }[]
                ).map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setBulkScope(value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${
                      bulkScope === value
                        ? value === "all"
                          ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                          : "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-medium">{label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {bulkScope === "level" && (
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Level
                </label>
                <div className="flex gap-2">
                  {[100, 200, 300, 400].map((l) => (
                    <button
                      key={l}
                      onClick={() => setBulkLevel(l)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                        bulkLevel === l
                          ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      Level {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {bulkResult && (
              <p
                className={`text-sm px-3 py-2 rounded-lg ${
                  bulkResult.startsWith("Error")
                    ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                    : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {bulkResult}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkResult(null);
                }}
              >
                Cancel
              </Button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
              >
                {bulkDeleting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 size={14} />
                    {bulkScope === "all" ? "Delete Everything" : "Delete"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
