"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import { Errors, Actions } from "./EditorShared";
import { ExamQuestion, TrueFalseQuestion } from "../new/types";

type Props = {
  initial?: TrueFalseQuestion;
  onSave: (q: ExamQuestion) => void;
  onCancel: () => void;
};

export default function TrueFalseEditor({ initial, onSave, onCancel }: Props) {
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
