"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { ExamDraft } from "./types";

type Course = { slug: string; title: string };

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const TYPES = ["Midsem", "End of Sem", "Topic", "Quiz"] as const;

type Props = {
  draft: ExamDraft;
  onChange: (patch: Partial<ExamDraft>) => void;
  onNext: () => void;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function ExamMetaStep({ draft, onChange, onNext }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExamDraft, string>>
  >({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/courses`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCourses(data);
      } catch {
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (draft.title && draft.courseSlug) {
      const generated = `${slugify(draft.courseSlug)}-${slugify(draft.title)}`;
      onChange({ id: generated });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.title, draft.courseSlug]);

  const validate = () => {
    const e: Partial<Record<keyof ExamDraft, string>> = {};
    if (!draft.title.trim()) e.title = "Title is required";
    if (!draft.courseSlug) e.courseSlug = "Please select a course";
    if (!draft.id.trim()) e.id = "Exam ID is required";
    if (!draft.duration || draft.duration < 1)
      e.duration = "Duration must be at least 1 minute";
    setErrors(e);
    if (!draft.type) e.type = "Please select an exam type";
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Course <span className="text-red-400">*</span>
        </label>
        {loadingCourses ? (
          <Loader label="Loading courses..." />
        ) : (
          <select
            value={draft.courseSlug}
            onChange={(e) => onChange({ courseSlug: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none transition
              ${
                errors.courseSlug
                  ? "border-red-400 focus:ring-2 focus:ring-red-300"
                  : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
              }`}
          >
            <option value="">Select a course...</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        )}
        {errors.courseSlug && (
          <p className="text-xs text-red-400 mt-1">{errors.courseSlug}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Exam Title <span className="text-red-400">*</span>
        </label>
        <Input
          placeholder="e.g. Thermodynamics Basics"
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        {errors.title && (
          <p className="text-xs text-red-400 mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Exam ID{" "}
          <span className="text-xs font-normal text-slate-400">
            (auto-generated, must be unique)
          </span>
        </label>
        <Input
          placeholder="e.g. thermodynamics-basics"
          value={draft.id}
          onChange={(e) => onChange({ id: e.target.value })}
        />
        {errors.id && <p className="text-xs text-red-400 mt-1">{errors.id}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Duration (minutes) <span className="text-red-400">*</span>
        </label>
        <Input
          type="number"
          min={1}
          placeholder="e.g. 45"
          value={draft.duration}
          onChange={(e) => onChange({ duration: Number(e.target.value) })}
        />
        {errors.duration && (
          <p className="text-xs text-red-400 mt-1">{errors.duration}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Difficulty
        </label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => onChange({ difficulty: d })}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                draft.difficulty === d
                  ? d === "Easy"
                    ? "bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : d === "Medium"
                      ? "bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                      : "bg-red-50 border-red-400 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Exam Type <span className="text-red-400">*</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => onChange({ type: t })}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                draft.type === t
                  ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {errors.type && (
          <p className="text-xs text-red-400 mt-1">{errors.type}</p>
        )}
      </div>

      <div className="pt-2">
        <Button variant="primary" onClick={handleNext}>
          Next: Add Questions
        </Button>
      </div>
    </div>
  );
}
