"use client";

import { ExamQuestion, KIND_LABELS } from "./types";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";

type Props = {
  question: ExamQuestion;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

const KIND_COLORS: Record<ExamQuestion["kind"], string> = {
  mcq: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  true_false:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  fill_in:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  pictorial_mcq:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
};

function getAnswerPreview(q: ExamQuestion): string {
  if (
    q.kind === "mcq" ||
    q.kind === "true_false" ||
    q.kind === "pictorial_mcq"
  ) {
    return `Answer: ${q.answer}`;
  }
  if (q.kind === "fill_in") {
    if (q.answerType === "range")
      return `Answer: ${q.answerMin} - ${q.answerMax}`;
    if (q.answerType === "number") {
      return q.tolerance
        ? `Answer: ${q.answer} ± ${q.tolerance}`
        : `Answer: ${q.answer}`;
    }
    return `Answer: ${q.answer}`;
  }
  return "";
}

export default function QuestionCard({
  question,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  return (
    <div className="flex items-start gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
        <span className="text-xs font-bold text-slate-400 w-6 text-center">
          {index + 1}
        </span>
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition"
        >
          <ChevronUp size={14} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${KIND_COLORS[question.kind]}`}
          >
            {KIND_LABELS[question.kind]}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
          {question.question}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {getAnswerPreview(question)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="text-slate-400 hover:text-blue-500 transition"
          title="Edit question"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition"
          title="Delete question"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
