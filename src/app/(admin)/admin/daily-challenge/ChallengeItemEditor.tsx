"use client";

import {
  ChallengeItem,
  PreambleBlock,
  MultiSelectQuestion,
  FillInQuestion,
  MCQQuestion,
  PictorialMCQQuestion,
  TrueFalseQuestion,
} from "@/mock/challenge";
import PreambleEditor from "./editors/PreambleEditor";
import MultiSelectEditor from "./editors/MultiSelectorEditor";
import ChallengeFillInEditor from "./editors/ChallengeFillInEditor";
import MCQEditor from "@/app/(admin)/admin/exams/features/MCQEditor";
import TrueFalseEditor from "@/app/(admin)/admin/exams/features/TrueFalseEditor";

type Props = {
  kind: ChallengeItem["kind"];
  fillInSubType?: "text" | "number" | "range" | "multi_text";
  initial?: ChallengeItem;
  onSave: (item: ChallengeItem) => void;
  onCancel: () => void;
};

const KIND_TITLES: Record<string, string> = {
  preamble: "Preamble Block",
  mcq: "Multiple Choice Question",
  pictorial_mcq: "Image MCQ Question",
  true_false: "True / False Question",
  fill_in_text: "Fill In — Text",
  fill_in_number: "Fill In — Number",
  fill_in_range: "Fill In — Range",
  fill_in_multi_text: "Fill In — Multiple Accepted Answers",
  multi_select: "Multi-Select Question",
};

export default function ChallengeItemEditor({
  kind,
  fillInSubType,
  initial,
  onSave,
  onCancel,
}: Props) {
  const titleKey =
    kind === "fill_in" ? `fill_in_${fillInSubType ?? "text"}` : kind;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">
          {kind === "preamble" ? "Context Block" : "New Question"}
        </p>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {KIND_TITLES[titleKey] ?? kind}
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        {kind === "preamble" && (
          <PreambleEditor
            initial={initial as PreambleBlock}
            onSave={onSave}
            onCancel={onCancel}
          />
        )}

        {kind === "multi_select" && (
          <MultiSelectEditor
            initial={initial as MultiSelectQuestion}
            onSave={onSave}
            onCancel={onCancel}
          />
        )}

        {kind === "fill_in" && (
          <ChallengeFillInEditor
            initial={initial as FillInQuestion | undefined}
            defaultAnswerType={fillInSubType}
            onSave={onSave}
            onCancel={onCancel}
          />
        )}

        {(kind === "mcq" || kind === "pictorial_mcq") && (
          <MCQEditor
            initial={initial as MCQQuestion | PictorialMCQQuestion}
            withImage={kind === "pictorial_mcq"}
            onSave={onSave}
            onCancel={onCancel}
          />
        )}

        {kind === "true_false" && (
          <TrueFalseEditor
            initial={initial as TrueFalseQuestion}
            onSave={onSave}
            onCancel={onCancel}
          />
        )}
      </div>
    </div>
  );
}
