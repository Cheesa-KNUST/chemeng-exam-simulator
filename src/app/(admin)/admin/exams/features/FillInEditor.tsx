"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import { Errors, Actions } from "./EditorShared";
import { ExamQuestion, FillInQuestion } from "../new/types";

type Props = {
  initial?: FillInQuestion;
  onSave: (q: ExamQuestion) => void;
  onCancel: () => void;
};

type AnswerType = "text" | "number" | "range";

function resolveInitialAnswerType(initial?: FillInQuestion): AnswerType {
  if (!initial) return "text";
  return (initial.answerType as AnswerType) ?? "text";
}

export default function FillInEditor({ initial, onSave, onCancel }: Props) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answerType, setAnswerType] = useState<AnswerType>(
    resolveInitialAnswerType(initial),
  );

  const [textAnswer, setTextAnswer] = useState(
    typeof initial?.answer === "string" ? initial.answer : "",
  );
  const [numAnswer, setNumAnswer] = useState(
    typeof initial?.answer === "number" ? String(initial.answer) : "",
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

  const [errors, setErrors] = useState<string[]>([]);

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
    setErrors(e);
    if (e.length > 0) return;

    if (answerType === "text") {
      onSave({
        id: "",
        kind: "fill_in",
        answerType: "text",
        question,
        answer: textAnswer,
      });
    } else if (answerType === "number") {
      onSave({
        id: "",
        kind: "fill_in",
        answerType: "number",
        question,
        answer: Number(numAnswer),
        tolerance: tolerance ? Number(tolerance) : undefined,
      });
    } else {
      const min = Number(minAnswer);
      const max = Number(maxAnswer);
      onSave({
        id: "",
        kind: "fill_in",
        answerType: "range",
        question,
        answerMin: min,
        answerMax: max,
        answer: `${min}-${max}`,
      });
    }
  };

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

      <div>
        <label className="field-label">Answer Type</label>
        <div className="flex gap-2">
          {(["text", "number", "range"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setAnswerType(t)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition capitalize ${
                answerType === t
                  ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

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

      <Errors errors={errors} />
      <Actions onSave={handleSave} onCancel={onCancel} />
    </div>
  );
}
