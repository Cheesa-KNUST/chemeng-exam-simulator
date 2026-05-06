"use client";

import {
  CheckCircle2,
  XCircle,
  Flag,
  Clock,
  Send,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

type ReviewSidebarProps = {
  examTitle: string;
  answered: number;
  unanswered: number;
  flaggedCount: number;
  total: number;
  timeLeft: number;
  isTimeUp: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onReturn: () => void;
};

export default function ReviewSidebar({
  examTitle,
  answered,
  unanswered,
  flaggedCount,
  total,
  timeLeft,
  isTimeUp,
  isSubmitting,
  onSubmit,
  onReturn,
}: ReviewSidebarProps) {
  const answeredPercent = Math.round((answered / total) * 100);
  const isLow = !isTimeUp && timeLeft <= 60;

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          CHEM<span className="text-blue-500 dark:text-blue-400">ENG</span>
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 uppercase tracking-widest">
          Assessment System
        </p>

        <div className="mt-5 mb-5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
            Active Exam
          </p>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug truncate">
            {examTitle}
          </p>
        </div>
      </div>

      <div className="px-5 py-5 flex-1 flex flex-col gap-5 overflow-y-auto">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Session Summary
          </p>

          <div className="mb-4">
            <div className="flex items-end justify-between mb-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Completion
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {answeredPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  answeredPercent === 100
                    ? "bg-emerald-500"
                    : answeredPercent >= 60
                      ? "bg-blue-500"
                      : "bg-amber-400"
                }`}
                style={{ width: `${answeredPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-px">
            {[
              {
                icon: <CheckCircle2 size={14} className="text-emerald-500" />,
                label: "Answered",
                value: answered,
                valueClass: "text-emerald-600 dark:text-emerald-400",
              },
              {
                icon: <XCircle size={14} className="text-red-400" />,
                label: "Unanswered",
                value: unanswered,
                valueClass: "text-red-500 dark:text-red-400",
              },
              {
                icon: <Flag size={14} className="text-amber-400" />,
                label: "Flagged",
                value: flaggedCount,
                valueClass: "text-amber-600 dark:text-amber-400",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-3 py-2.5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {row.icon}
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {row.label}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold tabular-nums ${row.valueClass}`}
                >
                  {row.value}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between px-3 py-2.5 transition-colors">
              <div className="flex items-center gap-4">
                <Clock
                  size={14}
                  className="text-slate-400 dark:text-slate-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Time Left
                </span>
              </div>
              <span
                className={`text-sm font-bold tabular-nums ${
                  isTimeUp
                    ? "text-red-500"
                    : isLow
                      ? "text-amber-500"
                      : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {isTimeUp ? "Expired" : formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="mt-3 px-3">
            {unanswered === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={13} />
                <p className="text-xs font-semibold">All questions answered</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                <span className="font-semibold text-red-500">{unanswered}</span>{" "}
                question
                {unanswered !== 1 ? "s" : ""} unanswered.
                {!isTimeUp && " You can still go back."}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-slate-800 dark:bg-slate-800 text-white dark:text-slate-20 text-sm font-bold hover:bg-slate-700 dark:hover:bg-slate-900 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </>
          ) : (
            <>
              <Send size={14} />
              Confirm & Submit
            </>
          )}
        </button>

        {!isTimeUp ? (
          <button
            onClick={onReturn}
            className="w-full flex items-center justify-center gap-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-600 text-slate-100 dark:text-slate-50 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all"
          >
            <ArrowLeft size={14} />
            Return to Exam
          </button>
        ) : (
          <div className="flex items-start justify-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60">
            <p className="text-md font-bold text-red-500 dark:text-red-400 leading-relaxed">
              Session ended
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
