"use client";

import {
  ChallengeItem,
  PreambleBlock,
  CHALLENGE_KIND_LABELS,
} from "@/mock/challenge";
import {
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  Link2,
  Link2Off,
} from "lucide-react";

type Props = {
  item: ChallengeItem;
  questionNumber: number;
  total: number;
  preambles: PreambleBlock[];
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onLinkPreamble: (groupId: string | null) => void;
  isFirst: boolean;
  isLast: boolean;
};

const KIND_COLORS: Record<ChallengeItem["kind"], string> = {
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

function getPreview(item: ChallengeItem): string {
  if (item.kind === "preamble")
    return item.content.slice(0, 80) + (item.content.length > 80 ? "…" : "");
  if (item.kind === "multi_select")
    return `${item.answers.length} correct answers`;
  if (item.kind === "fill_in") {
    if (item.answerType === "multi_text")
      return `${item.acceptedAnswers.length} accepted answers`;
    if (item.answerType === "range")
      return `Answer: ${item.answerMin} – ${item.answerMax}`;
    if (item.answerType === "number")
      return `Answer: ${item.answer}${item.tolerance ? ` ± ${item.tolerance}` : ""}`;
    return `Answer: ${item.answer}`;
  }
  if ("answer" in item) return `Answer: ${item.answer}`;
  return "";
}

export default function ChallengeItemCard({
  item,
  questionNumber,
  preambles,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onLinkPreamble,
  isFirst,
  isLast,
}: Props) {
  const isPreamble = item.kind === "preamble";
  const linkedPreambleId = !isPreamble
    ? ((item as { preambleId?: string }).preambleId ?? null)
    : null;
  const linkedPreamble = linkedPreambleId
    ? preambles.find((p) => p.groupId === linkedPreambleId)
    : null;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl p-4 border ${
        isPreamble
          ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
          : linkedPreamble
            ? "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 ml-6 border-l-4 border-l-blue-300 dark:border-l-blue-700 rounded-l-none"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
        <span className="text-xs font-bold text-slate-400 w-6 text-center">
          {isPreamble ? (
            <FileText size={12} className="mx-auto" />
          ) : (
            questionNumber
          )}
        </span>
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition"
        >
          <ChevronUp size={14} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${KIND_COLORS[item.kind]}`}
          >
            {CHALLENGE_KIND_LABELS[item.kind]}
          </span>

          {!isPreamble && linkedPreamble && (
            <span className="flex items-center gap-1 text-[10px] text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-700">
              <Link2 size={9} />
              {linkedPreamble.content.slice(0, 24)}…
            </span>
          )}
        </div>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
          {"question" in item ? item.question : item.content.split("\n")[0]}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">
          {getPreview(item)}
        </p>

        {!isPreamble && preambles.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <select
              value={linkedPreambleId ?? ""}
              onChange={(e) => onLinkPreamble(e.target.value || null)}
              className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 outline-none focus:border-blue-400 transition"
            >
              <option value="">No preamble</option>
              {preambles.map((p) => (
                <option key={p.groupId} value={p.groupId}>
                  {p.content.slice(0, 40)}…
                </option>
              ))}
            </select>
            {linkedPreambleId && (
              <button
                onClick={() => onLinkPreamble(null)}
                className="text-slate-400 hover:text-red-400 transition"
                title="Unlink preamble"
              >
                <Link2Off size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="text-slate-400 hover:text-blue-500 transition"
          title="Edit"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition"
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
