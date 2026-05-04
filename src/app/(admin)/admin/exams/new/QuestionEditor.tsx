"use client";

import MCQEditor from "../features/MCQEditor";
import TrueFalseEditor from "../features/TrueFalseEditor";
import FillInEditor from "../features/FillInEditor";
import {
  ExamQuestion,
  MCQQuestion,
  TrueFalseQuestion,
  FillInQuestion,
  PictorialMCQQuestion,
} from "./types";

type Props = {
  kind: ExamQuestion["kind"];
  initial?: ExamQuestion;
  onSave: (q: ExamQuestion) => void;
  onCancel: () => void;
};

const KIND_TITLES: Record<ExamQuestion["kind"], string> = {
  mcq: "Multiple Choice Question",
  true_false: "True / False Question",
  fill_in: "Fill In Question",
  pictorial_mcq: "Image MCQ Question",
};

export default function QuestionEditor({
  kind,
  initial,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">
          New Question
        </p>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {KIND_TITLES[kind]}
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
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
        {kind === "fill_in" && (
          <FillInEditor
            initial={initial as FillInQuestion}
            onSave={onSave}
            onCancel={onCancel}
          />
        )}
      </div>
    </div>
  );
}
