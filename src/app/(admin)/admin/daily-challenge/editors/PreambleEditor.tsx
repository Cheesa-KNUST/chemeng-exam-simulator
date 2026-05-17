"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import {
  Errors,
  Actions,
} from "@/app/(admin)/admin/exams/features/EditorShared";
import { PreambleBlock } from "@/mock/challenge";
import Image from "next/image";

type Props = {
  initial?: PreambleBlock;
  onSave: (p: PreambleBlock) => void;
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

export default function PreambleEditor({ initial, onSave, onCancel }: Props) {
  const [content, setContent] = useState(initial?.content ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSave = () => {
    const e: string[] = [];
    if (!content.trim()) e.push("Preamble text is required.");
    if (image && !isValidUrl(image)) e.push("Image URL is not valid.");
    setErrors(e);
    if (e.length > 0) return;

    onSave({
      id: initial?.id ?? "",
      kind: "preamble",
      content: content.trim(),
      image: image.trim() || undefined,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="field-label">Preamble Text</label>
        <textarea
          rows={6}
          placeholder="Enter the reading passage, context, or scenario that precedes the questions..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition resize-none"
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
              alt="Preamble preview"
              width={600}
              height={300}
              className="w-full object-contain"
            />
          </div>
        )}
      </div>

      <Errors errors={errors} />
      <Actions onSave={handleSave} onCancel={onCancel} />
    </div>
  );
}
