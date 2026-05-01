"use client";

import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flag,
  CircleDot,
} from "lucide-react";

type Props = {
  examTitle: string;
  timeLeft: number;
  isTimeUp: boolean;
  answered: number;
  unanswered: number;
  flaggedCount: number;
  answeredPercent: number;
};

export default function ReviewHeader({
  examTitle,
  timeLeft,
  isTimeUp,
  answered,
  unanswered,
  flaggedCount,
  answeredPercent,
}: Props) {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <header
      className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 pt-5 pb-4"
      style={{ "--review-header-h": "auto" } as React.CSSProperties}
    >
      {isTimeUp && (
        <div className="flex items-start gap-3 px-4 py-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60">
          <AlertTriangle
            size={14}
            className="text-red-500 dark:text-red-400 mt-px shrink-0"
          />
          <p className="text-sm text-red-700 dark:text-red-300 leading-snug">
            <span className="font-semibold">Time&apos;s up.</span> Your session
            ended automatically. Review your answers then confirm submission.
          </p>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
            {examTitle}
          </p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Review Your Answers
          </h1>
        </div>

        <div
          className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border ${
            isTimeUp
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              : timeLeft <= 60
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-600 dark:text-amber-400"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          }`}
        >
          <Clock
            size={13}
            className={!isTimeUp && timeLeft <= 60 ? "animate-pulse" : ""}
          />
          {isTimeUp ? "Expired" : formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3.5">
        {[
          {
            icon: <CheckCircle2 size={11} />,
            label: `${answered} answered`,
            cls: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-900",
          },
          {
            icon: <XCircle size={11} />,
            label: `${unanswered} unanswered`,
            cls: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-900",
          },
          {
            icon: <Flag size={11} />,
            label: `${flaggedCount} flagged`,
            cls: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-900",
          },
          {
            icon: <CircleDot size={11} />,
            label: `${answeredPercent}% complete`,
            cls: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-900",
          },
        ].map((p) => (
          <span
            key={p.label}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${p.cls}`}
          >
            {p.icon}
            {p.label}
          </span>
        ))}
      </div>
    </header>
  );
}
