"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import QuestionEditor from "./QuestionEditor";
import QuestionCard from "./QuestionCard";
import ImportQuestionsModal from "../features/ImportQuestionsModal";
import { ExamQuestion } from "./types";
import { PlusCircle, AlertCircle, FileUp } from "lucide-react";

type Props = {
  questions: ExamQuestion[];
  onChange: (questions: ExamQuestion[]) => void;
  onBack: () => void;
  onNext: () => void;
};

type QuestionKind = ExamQuestion["kind"];

const KIND_OPTIONS: {
  kind: QuestionKind;
  label: string;
  description: string;
}[] = [
  {
    kind: "mcq",
    label: "Multiple Choice",
    description: "One correct answer from 2-6 options",
  },
  {
    kind: "true_false",
    label: "True / False",
    description: "Binary True or False question",
  },
  {
    kind: "fill_in",
    label: "Fill In",
    description: "Text, number, or numeric range answer",
  },
  {
    kind: "pictorial_mcq",
    label: "Image MCQ",
    description: "MCQ with a supporting diagram or image",
  },
];

function genId(kind: QuestionKind, index: number) {
  return `q${index + 1}-${kind}-${Date.now()}`;
}

export default function QuestionBuilderStep({
  questions,
  onChange,
  onBack,
  onNext,
}: Props) {
  const [adding, setAdding] = useState<QuestionKind | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);

  const handleAdd = (q: ExamQuestion) => {
    const newQ = { ...q, id: genId(q.kind, questions.length) };
    onChange([...questions, newQ]);
    setAdding(null);
  };

  const handleUpdate = (q: ExamQuestion) => {
    const updated = questions.map((existing, i) =>
      i === editingIndex ? q : existing,
    );
    onChange(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...questions];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    onChange(arr);
  };

  const handleMoveDown = (index: number) => {
    if (index === questions.length - 1) return;
    const arr = [...questions];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    onChange(arr);
  };

  const handleImport = (imported: ExamQuestion[]) => {
    const stamped = imported.map((q, i) => ({
      ...q,
      id: genId(q.kind, questions.length + i),
    }));
    onChange([...questions, ...stamped]);
    setShowImport(false);
    setError(null);
  };

  const handleNext = () => {
    if (questions.length === 0) {
      setError("Add at least one question before continuing.");
      return;
    }
    setError(null);
    onNext();
  };

  if (editingIndex !== null) {
    return (
      <QuestionEditor
        kind={questions[editingIndex].kind}
        initial={questions[editingIndex]}
        onSave={handleUpdate}
        onCancel={() => setEditingIndex(null)}
      />
    );
  }

  if (adding) {
    return (
      <QuestionEditor
        kind={adding}
        onSave={handleAdd}
        onCancel={() => setAdding(null)}
      />
    );
  }

  return (
    <>
      {showImport && (
        <ImportQuestionsModal
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
              <FileUp size={16} className="text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Import from file
              </p>
              <p className="text-xs text-slate-400">
                Upload a PDF exam paper or a JSON question file
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => setShowImport(true)}>
            <span className="flex items-center gap-1.5">
              <FileUp size={14} />
              Import
            </span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-400 dark:bg-slate-800 flex-1" />
          <span className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            or
          </span>
          <div className="h-px bg-slate-400 dark:bg-slate-800 flex-1" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <PlusCircle size={14} />
            Add a Question Manually
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {KIND_OPTIONS.map(({ kind, label, description }) => (
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

        {questions.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-400 dark:bg-slate-800 flex-1" />
            <span className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              QUESTIONS
            </span>
            <div className="h-px bg-slate-400 dark:bg-slate-800 flex-1" />
          </div>
        )}

        {questions.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {questions.length} Question{questions.length !== 1 ? "s" : ""}
            </p>
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                total={questions.length}
                onEdit={() => setEditingIndex(i)}
                onDelete={() => handleDelete(i)}
                onMoveUp={() => handleMoveUp(i)}
                onMoveDown={() => handleMoveDown(i)}
              />
            ))}
          </div>
        )}

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
    </>
  );
}
