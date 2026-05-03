"use client";

import Button from "@/components/ui/Button";
import { ExamDraft, KIND_LABELS } from "./types";
import { Clock, Flame, Layers, HelpCircle, AlertCircle } from "lucide-react";

type Props = {
  draft: ExamDraft;
  saving: boolean;
  saveError: string | null;
  onBack: () => void;
  onSave: () => void;
};

const DIFFICULTY_COLORS = {
  Easy: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
  Medium: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
  Hard: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
};

const KIND_COLORS: Record<string, string> = {
  mcq: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  true_false:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  fill_in:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  pictorial_mcq:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export default function ReviewStep({
  draft,
  saving,
  saveError,
  onBack,
  onSave,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Exam Details
        </p>

        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          {draft.title}
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          ID: <span className="font-mono">{draft.id}</span>
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Layers size={14} />
            Course:{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {draft.courseSlug}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Clock size={14} />
            {draft.duration} mins
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Flame size={14} />
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-semibold ${DIFFICULTY_COLORS[draft.difficulty]}`}
            >
              {draft.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <HelpCircle size={14} />
            {draft.questions.length} question
            {draft.questions.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Questions
        </p>
        <div className="space-y-2">
          {draft.questions.map((q, i) => (
            <div
              key={q.id}
              className="flex items-start gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3"
            >
              <span className="text-xs font-bold text-slate-400 w-5 shrink-0 pt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-200 truncate">
                  {q.question}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0 ${KIND_COLORS[q.kind]}`}
              >
                {KIND_LABELS[q.kind]}
              </span>
            </div>
          ))}
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
              Saving...
            </span>
          ) : (
            "Publish Exam"
          )}
        </Button>
      </div>
    </div>
  );
}
