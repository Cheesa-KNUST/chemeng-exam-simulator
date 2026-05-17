"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Errors,
  Actions,
} from "@/app/(admin)/admin/exams/features/EditorShared";
import { FillInQuestion } from "@/mock/challenge";

type Props = {
  initial?: Extract<FillInQuestion, { answerType: "multi_text" }>;
  onSave: (q: FillInQuestion) => void;
  onCancel: () => void;
};

export default function FillInMultiTextEditor({
  initial,
  onSave,
  onCancel,
}: Props) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [accepted, setAccepted] = useState<string[]>(
    initial?.acceptedAnswers ?? [""],
  );
  const [errors, setErrors] = useState<string[]>([]);

  const updateAnswer = (i: number, val: string) => {
    setAccepted(accepted.map((a, idx) => (idx === i ? val : a)));
  };

  const removeAnswer = (i: number) => {
    setAccepted(accepted.filter((_, idx) => idx !== i));
  };

  const handleSave = () => {
    const e: string[] = [];
    if (!question.trim()) e.push("Question text is required.");
    const filled = accepted.filter((a) => a.trim());
    if (filled.length < 1) e.push("At least one accepted answer is required.");
    setErrors(e);
    if (e.length > 0) return;

    onSave({
      id: initial?.id ?? "",
      kind: "fill_in",
      answerType: "multi_text",
      question: question.trim(),
      acceptedAnswers: filled.map((a) => a.trim()),
      answer: filled[0],
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="field-label">Question Text</label>
        <Input
          placeholder="e.g. The process of converting solid directly to gas is called ___."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <p className="text-xs text-slate-400 mt-1">
          Use ___ to indicate where the blank appears.
        </p>
      </div>

      <div>
        <label className="field-label">Accepted Answers</label>
        <p className="text-xs text-slate-400 mb-2">
          Any one of these will be accepted as correct. Add common variations,
          abbreviations, or alternate spellings.
        </p>
        <div className="space-y-2">
          {accepted.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-4 shrink-0 text-right">
                {i + 1}.
              </span>
              <Input
                placeholder={
                  i === 0
                    ? "Primary answer (shown in review)"
                    : `Alternate answer ${i + 1}`
                }
                value={a}
                onChange={(e) => updateAnswer(i, e.target.value)}
              />
              {accepted.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAnswer(i)}
                  className="shrink-0 text-slate-400 hover:text-red-400 transition"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        {accepted.length < 8 && (
          <button
            type="button"
            onClick={() => setAccepted([...accepted, ""])}
            className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <PlusCircle size={14} /> Add alternate answer
          </button>
        )}
      </div>

      <Errors errors={errors} />
      <Actions onSave={handleSave} onCancel={onCancel} />
    </div>
  );
}
