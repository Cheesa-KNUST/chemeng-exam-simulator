"use client";

import Button from "@/components/ui/Button";
import { ChallengeDraft } from "./types";
import { CHALLENGE_KIND_LABELS } from "@/mock/challenge";
import {
  Clock,
  CalendarDays,
  Layers,
  AlertCircle,
  FileText,
} from "lucide-react";

type Props = {
  draft: ChallengeDraft;
  saving: boolean;
  saveError: string | null;
  onBack: () => void;
  onSave: () => void;
};

const KIND_COLORS: Record<string, string> = {
  preamble: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  mcq: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
  pictorial_mcq:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  true_false:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  fill_in:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  multi_select:
    "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
};

function getQuestionNumber(
  items: ChallengeDraft["items"],
  index: number,
): number {
  return items.slice(0, index + 1).filter((item) => item.kind !== "preamble")
    .length;
}

export default function ChallengeReviewStep({
  draft,
  saving,
  saveError,
  onBack,
  onSave,
}: Props) {
  const today = new Date().toISOString().split("T")[0];
  const isToday = draft.date === today;
  const scoredCount = draft.items.filter((i) => i.kind !== "preamble").length;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Challenge Details
        </p>

        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          {draft.title}
        </h2>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Layers size={14} />
            Level {draft.targetLevel}
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Layers size={14} />
            {draft.courseSlug}
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <CalendarDays size={14} />
            <span>
              {draft.date}
              {isToday && (
                <span className="ml-2 text-xs text-emerald-500 font-semibold">
                  Goes live today
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Clock size={14} />
            {draft.duration} min &middot; {scoredCount} question
            {scoredCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Items ({draft.items.length})
        </p>
        <div className="space-y-2">
          {draft.items.map((item, i) => {
            const isPreamble = item.kind === "preamble";
            const qNum = isPreamble ? null : getQuestionNumber(draft.items, i);

            return (
              <div
                key={item.id || i}
                className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${
                  isPreamble
                    ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                }`}
              >
                <span className="text-xs font-bold text-slate-400 w-5 shrink-0 pt-0.5">
                  {isPreamble ? <FileText size={12} /> : qNum}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200 truncate">
                    {"question" in item
                      ? item.question
                      : item.content.split("\n")[0]}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0 ${KIND_COLORS[item.kind]}`}
                >
                  {CHALLENGE_KIND_LABELS[item.kind]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {saveError && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
          <AlertCircle size={15} />
          {saveError}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onBack} disabled={saving}>
          Back
        </Button>
        <Button variant="primary" onClick={onSave} disabled={saving}>
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publishing...
            </span>
          ) : isToday ? (
            "Publish Now"
          ) : (
            `Schedule for ${draft.date}`
          )}
        </Button>
      </div>
    </div>
  );
}
