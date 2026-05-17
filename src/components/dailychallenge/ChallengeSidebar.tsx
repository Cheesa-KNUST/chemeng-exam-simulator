"use client";

import { Flame, CheckCircle2, Circle, Clock, Trophy } from "lucide-react";
import { ChallengeQuestion, PreambleBlock } from "@/mock/challenge";

type Props = {
  questions: ChallengeQuestion[];
  preambles: PreambleBlock[];
  current: number;
  answers: Record<string, unknown>;
  timeLabel: string;
  urgent: boolean;
  submitting: boolean;
  onJump: (id: string) => void;
  onSubmit: () => void;
};

const KIND_COLORS: Record<ChallengeQuestion["kind"], string> = {
  mcq: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
  pictorial_mcq:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  true_false:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  fill_in:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  multi_select:
    "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
};

const KIND_SHORT: Record<ChallengeQuestion["kind"], string> = {
  mcq: "MCQ",
  pictorial_mcq: "IMG",
  true_false: "T/F",
  fill_in: "FIL",
  multi_select: "MSQ",
};

export default function ChallengeSidebar({
  questions,
  preambles,
  current,
  answers,
  timeLabel,
  urgent,
  submitting,
  onJump,
  onSubmit,
}: Props) {
  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined,
  ).length;
  const total = questions.length;
  const unansweredCount = total - answeredCount;

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={16} className="text-orange-500" />
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Challenge
          </h2>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Click a question to jump to it
        </p>
      </div>

      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-xl border font-bold text-sm tabular-nums ${
            urgent
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock size={14} className={urgent ? "animate-pulse" : ""} />
            Time remaining
          </div>
          <span>{timeLabel}</span>
        </div>
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
        </div>
      </div>

      {preambles.length > 0 && (
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Preambles
          </p>
          <div className="space-y-1">
            {preambles.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800"
              >
                <span className="text-[10px] font-bold text-blue-400">
                  P{i + 1}
                </span>
                <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                  {p.content.slice(0, 32)}…
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-3 no-scrollbar">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
          Questions
        </p>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, i) => {
            const isActive = i === current;
            const isAnswered = answers[q.id] !== undefined;
            const linkedPreamble = (q as { preambleId?: string }).preambleId;

            return (
              <div
                key={q.id}
                onClick={() => onJump(q.id)}
                title={`Q${i + 1} — ${KIND_SHORT[q.kind]}${linkedPreamble ? " (has preamble)" : ""}`}
                className={`relative w-full aspect-square rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition-all border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105"
                    : isAnswered
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                }`}
              >
                {i + 1}
                <span
                  className={`absolute bottom-0.5 right-0.5 text-[7px] font-black px-0.5 rounded ${
                    isActive ? "text-blue-200" : KIND_COLORS[q.kind]
                  }`}
                >
                  {KIND_SHORT[q.kind]}
                </span>
                {linkedPreamble && (
                  <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-white dark:border-slate-950" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <div className="w-3 h-3 rounded-sm bg-blue-600" />
            Current
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800" />
            Answered
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            Has preamble
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition shadow-sm flex items-center justify-center gap-2 ${
            submitting
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
              : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-orange-500/20"
          }`}
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Trophy size={14} />
              Submit Challenge
            </>
          )}
        </button>

        {unansweredCount > 0 && (
          <p className="text-[11px] text-amber-500 dark:text-amber-400 text-center mt-2">
            {unansweredCount} question{unansweredCount !== 1 ? "s" : ""}{" "}
            unanswered
          </p>
        )}
      </div>
    </aside>
  );
}
