"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/ui/Input";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";
import { Errors, Actions } from "./EditorShared";
import { ExamQuestion, MCQQuestion, PictorialMCQQuestion } from "../new/types";

type Props = {
  initial?: MCQQuestion | PictorialMCQQuestion;
  withImage: boolean;
  onSave: (q: ExamQuestion) => void;
  onCancel: () => void;
};

function isValidImageUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function MCQEditor({
  initial,
  withImage,
  onSave,
  onCancel,
}: Props) {
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

  const updateOption = (index: number, value: string) => {
    if (answer === options[index]) setAnswer(value);
    setOptions(options.map((o, i) => (i === index ? value : o)));
  };

  const removeOption = (index: number) => {
    if (answer === options[index]) setAnswer("");
    setOptions(options.filter((_, i) => i !== index));
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
          {image &&
            (isValidImageUrl(image) ? (
              <Image
                src={image}
                alt="preview"
                width={300}
                height={200}
                className="rounded-lg mt-2"
              />
            ) : (
              <p className="text-xs text-red-400 mt-2">Invalid image URL</p>
            ))}
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
                onChange={(e) => updateOption(i, e.target.value)}
              />
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(i)}
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
