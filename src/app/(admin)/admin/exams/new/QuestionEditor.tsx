"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  ExamQuestion,
  MCQQuestion,
  TrueFalseQuestion,
  FillInQuestion,
  PictorialMCQQuestion,
} from "./types";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";

type Props = {
  kind: ExamQuestion["kind"];
  initial?: ExamQuestion;
  onSave: (q: ExamQuestion) => void;
  onCancel: () => void;
};

function MCQEditor({
  initial,
  withImage,
  onSave,
  onCancel,
}: {
  initial?: MCQQuestion | PictorialMCQQuestion;
  withImage: boolean;
  onSave: (q: ExamQuestion) => void;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [image, setImage] = useState(
    (initial as PictorialMCQQuestion)?.image ?? "",
  );
  const [options, setOptions] = useState<string[]>(
    initial?.options ?? ["", ""],
  );
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const e: string[] = [];
    if (!question.trim()) e.push("Question text is required.");
    if (withImage && !image.trim()) e.push("Image URL is required.");
    const filled = options.filter((o) => o.trim());
    if (filled.length < 2) e.push("At least 2 options are required.");
    if (!answer.trim()) e.push("Select or enter the correct answer.");
    if (answer && !options.includes(answer))
      e.push("Correct answer must match one of the options.");
    setErrors(e);
    return e.length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const filledOptions = options.filter((o) => o.trim());
    if (withImage) {
      onSave({
        id: "",
        kind: "pictorial_mcq",
        question,
        image,
        options: filledOptions,
        answer,
      });
    } else {
      onSave({ id: "", kind: "mcq", question, options: filledOptions, answer });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="field-label">Question Text</label>
        <Input
          placeholder="Enter the question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      {withImage && (
        <div>
          <label className="field-label">Image URL</label>
          <Input
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          {image && (
            <Image src={image} alt="preview" width={300} height={200} />
          )}
        </div>
      )}

      <div>
        <label className="field-label">Options</label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => setAnswer(opt)}
                title="Mark as correct answer"
                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                  answer === opt && opt.trim()
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-300 dark:border-slate-600 hover:border-emerald-400"
                }`}
              >
                {answer === opt && opt.trim() && <CheckCircle size={12} />}
              </button>
              <Input
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...options];
                  if (answer === options[i]) setAnswer(e.target.value);
                  updated[i] = e.target.value;
                  setOptions(updated);
                }}
              />
              {options.length > 2 && (
                <button
                  onClick={() => {
                    if (answer === options[i]) setAnswer("");
                    setOptions(options.filter((_, j) => j !== i));
                  }}
                  className="shrink-0 text-slate-400 hover:text-red-400 transition"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 6 && (
          <button
            onClick={() => setOptions([...options, ""])}
            className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <PlusCircle size={14} /> Add option
          </button>
        )}
        <p className="text-xs text-slate-400 mt-2">
          Click the circle next to an option to mark it as the correct answer.
        </p>
      </div>

      <Errors errors={errors} />
      <Actions onSave={handleSave} onCancel={onCancel} />
    </div>
  );
}

function TrueFalseEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: TrueFalseQuestion;
  onSave: (q: ExamQuestion) => void;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState<"True" | "False" | "">(
    initial?.answer ?? "",
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleSave = () => {
    const e: string[] = [];
    if (!question.trim()) e.push("Question text is required.");
    if (!answer) e.push("Select the correct answer.");
    setErrors(e);
    if (e.length > 0) return;
    onSave({
      id: "",
      kind: "true_false",
      question,
      options: ["True", "False"],
      answer: answer as "True" | "False",
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="field-label">Question Text</label>
        <Input
          placeholder="Enter a true/false statement..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div>
        <label className="field-label">Correct Answer</label>
        <div className="flex gap-3">
          {(["True", "False"] as const).map((val) => (
            <button
              key={val}
              onClick={() => setAnswer(val)}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${
                answer === val
                  ? val === "True"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "border-red-400 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      <Errors errors={errors} />
      <Actions onSave={handleSave} onCancel={onCancel} />
    </div>
  );
}

function FillInEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FillInQuestion;
  onSave: (q: ExamQuestion) => void;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answerType, setAnswerType] = useState<"text" | "number" | "range">(
    (initial as FillInQuestion)?.answerType ?? "text",
  );
  const [textAnswer, setTextAnswer] = useState(
    typeof initial?.answer === "string" ? initial.answer : "",
  );
  const [numAnswer, setNumAnswer] = useState(
    typeof initial?.answer === "number" ? String(initial.answer) : "",
  );
  const [tolerance, setTolerance] = useState(
    answerType === "number"
      ? String((initial as { tolerance?: unknown })?.tolerance ?? "")
      : "",
  );
  const [minAnswer, setMinAnswer] = useState(
    answerType === "range"
      ? String((initial as { answerMin?: unknown })?.answerMin ?? "")
      : "",
  );
  const [maxAnswer, setMaxAnswer] = useState(
    answerType === "range"
      ? String((initial as { answerMax?: unknown })?.answerMax ?? "")
      : "",
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

function Errors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 space-y-1">
      {errors.map((e, i) => (
        <p key={i} className="text-sm text-red-500">
          {e}
        </p>
      ))}
    </div>
  );
}

function Actions({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onSave}>
        Save Question
      </Button>
    </div>
  );
}

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
      <div className="mb-6">
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
