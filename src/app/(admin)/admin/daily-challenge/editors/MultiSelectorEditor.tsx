"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";
import {
  Errors,
  Actions,
} from "@/app/(admin)/admin/exams/features/EditorShared";
import { MultiSelectQuestion } from "@/mock/challenge";
import Image from "next/image";

type Props = {
  initial?: MultiSelectQuestion;
  onSave: (q: MultiSelectQuestion) => void;
  onCancel: () => void;
};

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function MultiSelectEditor({
  initial,
  onSave,
  onCancel,
}: Props) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [options, setOptions] = useState<string[]>(
    initial?.options ?? ["", "", ""],
  );
  const [answers, setAnswers] = useState<Set<string>>(
    new Set(initial?.answers ?? []),
  );
  const [errors, setErrors] = useState<string[]>([]);

  const updateOption = (index: number, value: string) => {
    const old = options[index];
    if (answers.has(old)) {
      setAnswers((prev) => {
        const next = new Set(prev);
        next.delete(old);
        if (value.trim()) next.add(value);
        return next;
      });
    }
    setOptions(options.map((o, i) => (i === index ? value : o)));
  };

  const removeOption = (index: number) => {
    const removed = options[index];
    setAnswers((prev) => {
      const next = new Set(prev);
      next.delete(removed);
      return next;
    });
    setOptions(options.filter((_, i) => i !== index));
  };

  const toggleAnswer = (opt: string) => {
    if (!opt.trim()) return;
    setAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) {
        next.delete(opt);
      } else {
        next.add(opt);
      }
      return next;
    });
  };

  const handleSave = () => {
    const e: string[] = [];
    if (!question.trim()) e.push("Question text is required.");
    if (image && !isValidUrl(image)) e.push("Image URL is not valid.");
    const filled = options.filter((o) => o.trim());
    if (filled.length < 2) e.push("At least 2 options are required.");
    if (answers.size < 2) e.push("Select at least 2 correct answers.");
    const invalidAnswers = [...answers].filter((a) => !options.includes(a));
    if (invalidAnswers.length > 0)
      e.push("All correct answers must match an option.");
    setErrors(e);
    if (e.length > 0) return;

    onSave({
      id: initial?.id ?? "",
      kind: "multi_select",
      question: question.trim(),
      image: image.trim() || undefined,
      options: filled,
      answers: filled.filter((o) => answers.has(o)),
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="field-label">Question Text</label>
        <Input
          placeholder="e.g. Which of the following are intensive properties?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div>
        <label className="field-label">
          Supporting Image{" "}
          <span className="text-xs font-normal text-slate-400">(optional)</span>
        </label>
        <Input
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        {image && isValidUrl(image) && (
          <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <Image
              src={image}
              alt="Question preview"
              width={400}
              height={250}
              className="w-full object-contain"
            />
          </div>
        )}
      </div>

      <div>
        <label className="field-label">Options & Correct Answers</label>
        <p className="text-xs text-slate-400 mb-2">
          Click the circle to mark an option as correct. At least 2 must be
          correct.
        </p>
        <div className="space-y-2">
          {options.map((opt, i) => {
            const isCorrect = answers.has(opt) && opt.trim() !== "";
            return (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAnswer(opt)}
                  title="Mark as correct"
                  className={`shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                    isCorrect
                      ? "border-purple-500 bg-purple-500 text-white"
                      : "border-slate-300 dark:border-slate-600 hover:border-purple-400"
                  }`}
                >
                  {isCorrect && <CheckCircle size={12} />}
                </button>
                <Input
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="shrink-0 text-slate-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {options.length < 6 && (
          <button
            type="button"
            onClick={() => setOptions([...options, ""])}
            className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <PlusCircle size={14} /> Add option
          </button>
        )}

        {answers.size > 0 && (
          <p className="text-xs text-purple-500 mt-2">
            {answers.size} correct answer{answers.size !== 1 ? "s" : ""}{" "}
            selected
          </p>
        )}
      </div>

      <Errors errors={errors} />
      <Actions onSave={handleSave} onCancel={onCancel} />
    </div>
  );
}
