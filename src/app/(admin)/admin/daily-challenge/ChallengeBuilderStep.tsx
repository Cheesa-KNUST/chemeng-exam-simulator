"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import Button from "@/components/ui/Button";
import ChallengeItemCard from "./ChallengeItemCard";
import ChallengeItemEditor from "./ChallengeItemEditor";
import { ChallengeItem, PreambleBlock } from "@/mock/challenge";
import { PlusCircle, AlertCircle, FileText } from "lucide-react";

type Props = {
  items: ChallengeItem[];
  onChange: (items: ChallengeItem[]) => void;
  onBack: () => void;
  onNext: () => void;
};

type AddKind =
  | "preamble"
  | "mcq"
  | "pictorial_mcq"
  | "true_false"
  | "multi_select"
  | "fill_in_text"
  | "fill_in_number"
  | "fill_in_range"
  | "fill_in_multi_text";

const ADD_OPTIONS: { kind: AddKind; label: string; description: string }[] = [
  {
    kind: "mcq",
    label: "Multiple Choice",
    description: "One correct answer from options",
  },
  {
    kind: "pictorial_mcq",
    label: "Image MCQ",
    description: "MCQ with a diagram or image",
  },
  {
    kind: "true_false",
    label: "True / False",
    description: "Binary true or false",
  },
  {
    kind: "multi_select",
    label: "Multi-Select",
    description: "Multiple correct answers",
  },
  {
    kind: "fill_in_text",
    label: "Fill In — Text",
    description: "Single text answer",
  },
  {
    kind: "fill_in_number",
    label: "Fill In — Number",
    description: "Numeric answer with tolerance",
  },
  {
    kind: "fill_in_range",
    label: "Fill In — Range",
    description: "Answer within a numeric range",
  },
  {
    kind: "fill_in_multi_text",
    label: "Fill In — Multi-Text",
    description: "Multiple accepted text answers",
  },
];

function parseKind(kind: AddKind): {
  itemKind: ChallengeItem["kind"];
  fillInSubType?: "text" | "number" | "range" | "multi_text";
} {
  if (kind.startsWith("fill_in_")) {
    return {
      itemKind: "fill_in",
      fillInSubType: kind.replace("fill_in_", "") as
        | "text"
        | "number"
        | "range"
        | "multi_text",
    };
  }
  return { itemKind: kind as ChallengeItem["kind"] };
}

function getQuestionNumber(items: ChallengeItem[], index: number): number {
  return items.slice(0, index + 1).filter((item) => item.kind !== "preamble")
    .length;
}

export default function ChallengeBuilderStep({
  items,
  onChange,
  onBack,
  onNext,
}: Props) {
  const [adding, setAdding] = useState<AddKind | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scoredCount = items.filter((i) => i.kind !== "preamble").length;
  const preambles = items.filter(
    (i): i is PreambleBlock => i.kind === "preamble",
  );

  const handleAdd = (item: ChallengeItem) => {
    const id = `ci-${nanoid(8)}`;
    const newItem: ChallengeItem =
      item.kind === "preamble"
        ? { ...item, id, groupId: nanoid(6) }
        : { ...item, id };
    onChange([...items, newItem]);
    setAdding(null);
  };

  const handleUpdate = (item: ChallengeItem) => {
    onChange(
      items.map((existing, i) => (i === editingIndex ? item : existing)),
    );
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const deleted = items[index];
    let updated = items.filter((_, i) => i !== index);
    if (deleted.kind === "preamble") {
      updated = updated.map((item) =>
        item.kind !== "preamble" &&
        (item as { preambleId?: string }).preambleId === deleted.groupId
          ? { ...item, preambleId: undefined }
          : item,
      );
    }
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...items];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    onChange(arr);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const arr = [...items];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    onChange(arr);
  };

  const handleLinkPreamble = (index: number, groupId: string | null) => {
    onChange(
      items.map((item, i) => {
        if (i !== index || item.kind === "preamble") return item;
        const base = { ...item } as typeof item & { preambleId?: string };

        if (groupId) {
          return { ...base, preambleId: groupId };
        }

        delete base.preambleId;
        return base;
      }),
    );
  };

  const handleNext = () => {
    if (scoredCount === 0) {
      setError(
        "Add at least one question (not counting preambles) before continuing.",
      );
      return;
    }
    setError(null);
    onNext();
  };

  if (editingIndex !== null) {
    const item = items[editingIndex];
    const fillInSubType =
      item.kind === "fill_in"
        ? ((item as { answerType?: string }).answerType as
            | "text"
            | "number"
            | "range"
            | "multi_text"
            | undefined)
        : undefined;
    return (
      <ChallengeItemEditor
        kind={item.kind}
        fillInSubType={fillInSubType}
        initial={item}
        onSave={handleUpdate}
        onCancel={() => setEditingIndex(null)}
      />
    );
  }

  if (adding) {
    const { itemKind, fillInSubType } = parseKind(adding);
    return (
      <ChallengeItemEditor
        kind={itemKind}
        fillInSubType={fillInSubType}
        onSave={handleAdd}
        onCancel={() => setAdding(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {items.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {items.length} item{items.length !== 1 ? "s" : ""} &middot;{" "}
            {scoredCount} question{scoredCount !== 1 ? "s" : ""}
          </p>

          {preambles.length > 0 && (
            <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
              Use the dropdown on each question to link it to a preamble.
              Questions are independent by default.
            </p>
          )}

          {items.map((item, i) => (
            <ChallengeItemCard
              key={item.id}
              item={item}
              questionNumber={
                item.kind === "preamble" ? 0 : getQuestionNumber(items, i)
              }
              total={items.length}
              preambles={preambles}
              onEdit={() => setEditingIndex(i)}
              onDelete={() => handleDelete(i)}
              onMoveUp={() => handleMoveUp(i)}
              onMoveDown={() => handleMoveDown(i)}
              onLinkPreamble={(groupId) => handleLinkPreamble(i, groupId)}
              isFirst={i === 0}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <PlusCircle size={14} />
          Add Item
        </p>

        <button
          onClick={() => setAdding("preamble")}
          className="w-full text-left p-4 mb-3 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-600 transition"
        >
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-blue-400" />
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Add Preamble
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Reading passage or context block. Questions are linked to it
            manually via their dropdown.
          </p>
        </button>

        <div className="grid sm:grid-cols-2 gap-3">
          {ADD_OPTIONS.map(({ kind, label, description }) => (
            <button
              key={kind}
              onClick={() => setAdding(kind)}
              className="text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition group"
            >
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Next: Review
        </Button>
      </div>
    </div>
  );
}
