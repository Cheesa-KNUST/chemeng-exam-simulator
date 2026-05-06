"use client";

import { CheckCircle2 } from "lucide-react";

type ReviewHeaderProps = {
  examTitle: string;
  answered: number;
  total: number;
  timeLeft: number;
  isTimeUp: boolean;
  onMenuClick?: () => void;
};

export default function ReviewHeader({
  examTitle,
  answered,
  total,
  timeLeft,
  isTimeUp,
}: ReviewHeaderProps) {
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const isLow = !isTimeUp && timeLeft <= 90;

  return (
    <header className="h-25 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-base md:text-lg font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-0.5">
            {examTitle}
          </p>
          <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
            Review Your Answers
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-5 py-4 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CheckCircle2
            size={13}
            className="text-emerald-500 dark:text-emerald-400"
          />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {answered}
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              {" "}
              / {total} answered
            </span>
          </span>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-5 py-4 rounded-3xl text-sm font-bold border transition-colors ${
            isTimeUp
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              : isLow
                ? "bg-red-200 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
                : "bg-slate-200 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          }`}
        >
          <span className={isLow ? "animate-pulse" : ""}>
            {isTimeUp ? "Expired" : `Time left: ${formatTime(timeLeft)}`}
          </span>
        </div>
      </div>
    </header>
  );
}
