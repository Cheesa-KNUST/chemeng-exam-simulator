"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { ExamDraft } from "./types";

type Course = { slug: string; title: string; level: number; semester: number };

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const TYPES = ["Midsem", "End of Sem", "Topic", "Quiz"] as const;
const LEVELS = [100, 200, 300, 400] as const;
const SEMESTERS = [1, 2] as const;

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
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExamDraft | "level" | "semester", string>>
  >({});

  const selectedCourse = courses.find((c) => c.slug === draft.courseSlug);
  const readyToFetch = draft.level !== null && draft.semester !== null;

  useEffect(() => {
    if (draft.level === null || draft.semester === null) return;

    let cancelled = false;

    const loadCourses = async () => {
      setLoadingCourses(true);

      try {
        const res = await fetch(
          `/api/courses?level=${draft.level}&semester=${draft.semester}`,
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        if (!cancelled) {
          setCourses(data);
        }
      } catch {
        if (!cancelled) {
          setCourses([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCourses(false);
        }
      }
    };

    loadCourses();

    return () => {
      cancelled = true;
    };
  }, [draft.level, draft.semester]);

  const handleLevelSelect = (level: number) => {
    if (draft.level === level) return;
    onChange({ level, courseSlug: "" });
  };

  const handleSemesterSelect = (semester: number) => {
    if (draft.semester === semester) return;
    onChange({ semester, courseSlug: "" });
  };

  useEffect(() => {
    if (draft.title && draft.courseSlug) {
      const generated = `${slugify(draft.courseSlug)}-${slugify(draft.title)}`;
      onChange({ id: generated });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.title, draft.courseSlug]);

  const validate = () => {
    const e: Partial<Record<keyof ExamDraft | "level" | "semester", string>> =
      {};
    if (!draft.level) e.level = "Please select a level";
    if (!draft.semester) e.semester = "Please select a semester";
    if (!draft.courseSlug) e.courseSlug = "Please select a course";
    if (!draft.title.trim()) e.title = "Title is required";
    if (!draft.id.trim()) e.id = "Exam ID is required";
    if (!draft.duration || draft.duration < 1)
      e.duration = "Duration must be at least 1 minute";
    if (!draft.type) e.type = "Please select an exam type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Level <span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => handleLevelSelect(l)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                  draft.level === l
                    ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                Level {l}
              </button>
            ))}
          </div>
          {errors.level && (
            <p className="text-xs text-red-400 mt-1">{errors.level}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Semester <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            {SEMESTERS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => handleSemesterSelect(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                  draft.semester === s
                    ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                Semester {s}
              </button>
            ))}
          </div>
          {errors.semester && (
            <p className="text-xs text-red-400 mt-1">{errors.semester}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Course <span className="text-red-400">*</span>
        </label>

        {!readyToFetch ? (
          <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-400">
            Select a level and semester first
          </div>
        ) : loadingCourses ? (
          <Loader label="Loading courses..." />
        ) : (
          <select
            value={draft.courseSlug}
            onChange={(e) => onChange({ courseSlug: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none transition ${
              errors.courseSlug
                ? "border-red-400 focus:ring-2 focus:ring-red-300"
                : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            }`}
          >
            <option value="">
              {courses.length === 0
                ? "No courses found for this level & semester"
                : "Select a course..."}
            </option>
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
        {selectedCourse && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Level {selectedCourse.level} &middot; Semester{" "}
            {selectedCourse.semester}
          </p>
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
          disabled
          className="opacity-80 cursor-not-allowed"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
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
                type="button"
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
      </div>

      <div className="pt-2">
        <Button variant="primary" onClick={handleNext}>
          Next: Add Questions
        </Button>
      </div>
    </div>
  );
}
