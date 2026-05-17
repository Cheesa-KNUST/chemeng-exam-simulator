"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Errors,
  Actions,
} from "@/app/(admin)/admin/exams/features/EditorShared";
import { FillInQuestion } from "@/mock/challenge";

type AnswerType = "text" | "number" | "range" | "multi_text";

type Props = {
  initial?: FillInQuestion;
  defaultAnswerType?: AnswerType;
  onSave: (q: FillInQuestion) => void;
  onCancel: () => void;
};

function resolveInitialType(
  initial?: FillInQuestion,
  defaultType?: AnswerType,
): AnswerType {
  if (initial?.answerType) return initial.answerType as AnswerType;
  return defaultType ?? "text";
}

export default function ChallengeFillInEditor({
  initial,
  defaultAnswerType,
  onSave,
  onCancel,
}: Props) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answerType, setAnswerType] = useState<AnswerType>(
    resolveInitialType(initial, defaultAnswerType),
  );

  const [textAnswer, setTextAnswer] = useState(
    initial && "answer" in initial && typeof initial.answer === "string"
      ? initial.answer
      : "",
  );

  const [numAnswer, setNumAnswer] = useState(
    initial && "answer" in initial && typeof initial.answer === "number"
      ? String(initial.answer)
      : "",
  );
  const [tolerance, setTolerance] = useState(
    String((initial as { tolerance?: unknown })?.tolerance ?? ""),
  );

  const [minAnswer, setMinAnswer] = useState(
    String((initial as { answerMin?: unknown })?.answerMin ?? ""),
  );
  const [maxAnswer, setMaxAnswer] = useState(
    String((initial as { answerMax?: unknown })?.answerMax ?? ""),
  );

  const [acceptedAnswers, setAcceptedAnswers] = useState<string[]>(
    (initial as { acceptedAnswers?: string[] })?.acceptedAnswers ?? [""],
  );

  const [errors, setErrors] = useState<string[]>([]);

  const updateAccepted = (i: number, val: string) =>
    setAcceptedAnswers(acceptedAnswers.map((a, idx) => (idx === i ? val : a)));

  const removeAccepted = (i: number) =>
    setAcceptedAnswers(acceptedAnswers.filter((_, idx) => idx !== i));

  const handleSave = () => {
    const e: string[] = [];
    if (!question.trim()) e.push("Question text is required.");

    if (answerType === "text" && !textAnswer.trim())
      e.push("Answer is required.");

    if (answerType === "number" && !numAnswer.trim())
      e.push("Answer is required.");

    if (answerType === "range") {
      if (!minAnswer.trim() || !maxAnswer.trim())
        e.push("Both min and max values are required.");
      else if (Number(minAnswer) >= Number(maxAnswer))
        e.push("Min must be less than max.");
    }

    if (answerType === "multi_text") {
      const filled = acceptedAnswers.filter((a) => a.trim());
      if (filled.length === 0)
        e.push("At least one accepted answer is required.");
    }

    setErrors(e);
    if (e.length > 0) return;

    if (answerType === "text") {
      onSave({
        id: initial?.id ?? "",
        kind: "fill_in",
        answerType: "text",
        question: question.trim(),
        answer: textAnswer.trim(),
      });
      return;
    }

    if (answerType === "number") {
      onSave({
        id: initial?.id ?? "",
        kind: "fill_in",
        answerType: "number",
        question: question.trim(),
        answer: Number(numAnswer),
        tolerance: tolerance ? Number(tolerance) : undefined,
      });
      return;
    }

    if (answerType === "range") {
      const min = Number(minAnswer);
      const max = Number(maxAnswer);
      onSave({
        id: initial?.id ?? "",
        kind: "fill_in",
        answerType: "range",
        question: question.trim(),
        answerMin: min,
        answerMax: max,
        answer: `${min}-${max}`,
      });
      return;
    }

    const filled = acceptedAnswers.filter((a) => a.trim()).map((a) => a.trim());
    onSave({
      id: initial?.id ?? "",
      kind: "fill_in",
      answerType: "multi_text",
      question: question.trim(),
      acceptedAnswers: filled,
      answer: filled[0],
    });
  };

  const lockType = !!defaultAnswerType;

  return (
    <div className="space-y-5">
      <div>
        <label className="field-label">Question Text</label>
        <Input
          placeholder="e.g. The SI unit of energy is the ___."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      {!lockType && (
        <div>
          <label className="field-label">Answer Type</label>
          <div className="flex flex-wrap gap-2">
            {(["text", "number", "range", "multi_text"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAnswerType(t)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition capitalize ${
                  answerType === t
                    ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
                }`}
              >
                {t === "multi_text" ? "Multi-Text" : t}
              </button>
            ))}
          </div>
        </div>
      )}

      {answerType === "text" && (
        <div>
          <label className="field-label">Correct Answer</label>
          <Input
            placeholder="e.g. joule"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
          />
        </div>
      )}

      {answerType === "number" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Correct Answer</label>
            <Input
              type="number"
              placeholder="e.g. 8.314"
              value={numAnswer}
              onChange={(e) => setNumAnswer(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">
              Tolerance{" "}
              <span className="text-xs font-normal text-slate-400">
                (optional ±)
              </span>
            </label>
            <Input
              type="number"
              placeholder="e.g. 0.01"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
            />
          </div>
        </div>
      )}

      {answerType === "range" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Min Value</label>
            <Input
              type="number"
              placeholder="e.g. 390"
              value={minAnswer}
              onChange={(e) => setMinAnswer(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Max Value</label>
            <Input
              type="number"
              placeholder="e.g. 410"
              value={maxAnswer}
              onChange={(e) => setMaxAnswer(e.target.value)}
            />
          </div>
        </div>
      )}

      {answerType === "multi_text" && (
        <div>
          <label className="field-label">Accepted Answers</label>
          <p className="text-xs text-slate-400 mb-2">
            Any one of these will be marked correct. Add variations,
            abbreviations, or alternate spellings.
          </p>
          <div className="space-y-2">
            {acceptedAnswers.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-4 text-right shrink-0">
                  {i + 1}.
                </span>
                <Input
                  placeholder={
                    i === 0
                      ? "Primary answer (shown in review)"
                      : `Alternate ${i + 1}`
                  }
                  value={a}
                  onChange={(e) => updateAccepted(i, e.target.value)}
                />
                {acceptedAnswers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAccepted(i)}
                    className="shrink-0 text-slate-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {acceptedAnswers.length < 8 && (
            <button
              type="button"
              onClick={() => setAcceptedAnswers([...acceptedAnswers, ""])}
              className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              <PlusCircle size={14} /> Add alternate answer
            </button>
          )}
        </div>
      )}

      <Errors errors={errors} />
      <Actions onSave={handleSave} onCancel={onCancel} />
    </div>
  );
}
