"use client";

import { useState } from "react";
import { Flag, CheckCircle2, Circle, AlertCircle } from "lucide-react";

type FilterTab = "all" | "flagged" | "unanswered";

type Props = {
  total: number;
  current: number;
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  onJump: (index: number) => void;
  onSubmit: () => void;
  onToggleFlag: (index: number) => void;
  disabled?: boolean;
};

export default function ExamSidebar({
  total,
  current,
  answers,
  flagged,
  onJump,
  onSubmit,
  onToggleFlag,
  disabled = false,
}: Props) {
  const [filter, setFilter] = useState<FilterTab>("all");

  const allIndices = Array.from({ length: total }, (_, i) => i);

  const filteredIndices = allIndices.filter((i) => {
    if (filter === "flagged") return flagged[i];
    if (filter === "unanswered") return !answers[i];
    return true;
  });

  const answeredCount = allIndices.filter((i) => !!answers[i]).length;
  const flaggedCount = allIndices.filter((i) => !!flagged[i]).length;
  const unansweredCount = total - answeredCount;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: total },
    { key: "flagged", label: "Flagged", count: flaggedCount },
    { key: "unanswered", label: "Unanswered", count: unansweredCount },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Question Navigator
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Click to jump · flag to review
        </p>
      </div>

      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Progress
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">
            {answeredCount} / {total}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${total > 0 ? (answeredCount / total) * 100 : 0}%`,
            }}
          />
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={12} />
            <span>{answeredCount} done</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Circle size={12} />
            <span>{unansweredCount} left</span>
          </div>
          {flaggedCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
              <Flag size={12} />
              <span>{flaggedCount} flagged</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 pb-2">
        <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.key
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && tab.key !== "all" && (
                <span
                  className={`ml-1 ${filter === tab.key ? "text-blue-500" : "text-slate-400 dark:text-slate-500"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 no-scrollbar">
        {filteredIndices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle
              size={20}
              className="text-slate-300 dark:text-slate-600 mb-2"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {filter === "flagged"
                ? "No flagged questions"
                : "All questions answered!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {filteredIndices.map((i) => {
              const isActive = i === current;
              const isAnswered = !!answers[i];
              const isFlagged = !!flagged[i];

              return (
                <div
                  key={i}
                  onClick={() => onJump(i)}
                  className={`relative w-full aspect-square rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition-all border ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105"
                      : isAnswered
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                  }`}
                >
                  {i + 1}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFlag(i);
                    }}
                    title={isFlagged ? "Remove flag" : "Flag for review"}
                    className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center transition-all border ${
                      isFlagged
                        ? "bg-red-500 border-red-500"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-red-300"
                    }`}
                  >
                    <Flag
                      size={8}
                      className={isFlagged ? "text-white" : "text-slate-400"}
                      fill={isFlagged ? "white" : "none"}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <div className="w-3 h-3 rounded-sm bg-blue-600" />
            Current
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800" />
            Answered
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            Flagged
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onSubmit}
          disabled={disabled}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
            disabled
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-500/20"
          }`}
        >
          Submit Exam
        </button>
        {flaggedCount > 0 && !disabled && (
          <p className="text-[11px] text-amber-500 dark:text-amber-400 text-center mt-2 flex items-center justify-center gap-1">
            <Flag size={10} />
            {flaggedCount} flagged question{flaggedCount > 1 ? "s" : ""} need
            review
          </p>
        )}
      </div>
    </aside>
  );
}
