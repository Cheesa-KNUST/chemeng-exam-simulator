"use client";

import {
  CheckCircle2,
  XCircle,
  Flag,
  Clock,
  Send,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

type Props = {
  answered: number;
  unanswered: number;
  flaggedCount: number;
  total: number;
  answeredPercent: number;
  timeLeft: number;
  isTimeUp: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onReturnToExam: () => void;
};

export default function ReviewSidebar({
  answered,
  unanswered,
  flaggedCount,
  total,
  answeredPercent,
  timeLeft,
  isTimeUp,
  isSubmitting,
  onSubmit,
  onReturnToExam,
}: Props) {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const rows = [
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
    {
      icon: (
        <Clock
          size={14}
          className={
            isTimeUp
              ? "text-red-400"
              : timeLeft <= 60
                ? "text-amber-400"
                : "text-slate-400 dark:text-slate-500"
          }
        />
      ),
      label: "Time left",
      value: isTimeUp ? "Expired" : formatTime(timeLeft),
      valueClass: isTimeUp
        ? "text-red-500 dark:text-red-400"
        : timeLeft <= 60
          ? "text-amber-600 dark:text-amber-400"
          : "text-slate-700 dark:text-slate-300",
    },
  ];

  return (
    <>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
          Session Summary
        </p>

        <div className="mb-5">
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              {answeredPercent}
              <span className="text-base font-semibold text-slate-400 dark:text-slate-500">
                %
              </span>
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
              {answered} / {total} done
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
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

        <div className="space-y-0">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between py-2.5 ${
                i < rows.length - 1
                  ? "border-b border-slate-100 dark:border-slate-700/60"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
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
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          {unanswered === 0 ? (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={12} />
              All questions answered — ready to submit.
            </p>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              <span className="font-semibold text-red-500">{unanswered}</span>{" "}
              question{unanswered !== 1 ? "s" : ""} still unanswered.
              {!isTimeUp && " You can still go back and answer them."}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold tracking-tight hover:bg-slate-700 dark:hover:bg-slate-100 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Submitting…
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
            onClick={onReturnToExam}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-[0.98] transition-all"
          >
            <ArrowLeft size={14} />
            Return to Exam
          </button>
        ) : (
          <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
            <AlertTriangle
              size={13}
              className="text-slate-400 dark:text-slate-500 mt-px shrink-0"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Session ended — you can no longer return to the exam.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
