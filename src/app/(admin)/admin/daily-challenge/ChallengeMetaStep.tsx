"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { ChallengeDraft } from "./types";

type Course = { slug: string; title: string; level: number; semester: number };

const LEVELS = [100, 200, 300, 400] as const;

type Props = {
  draft: ChallengeDraft;
  onChange: (patch: Partial<ChallengeDraft>) => void;
  onNext: () => void;
};

export default function ChallengeMetaStep({ draft, onChange, onNext }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChallengeDraft | "level", string>>
  >({});

  const readyToFetch = draft.targetLevel !== null;

  const fetchCourses = async (level: number) => {
    setLoadingCourses(true);
    setCourses([]);
    try {
      const res = await fetch(`/api/courses?level=${level}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCourses(data);
    } catch {
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleLevelSelect = (level: number) => {
    onChange({ targetLevel: level, courseSlug: "" });
    fetchCourses(level);
  };

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const e: Partial<Record<keyof ChallengeDraft | "level", string>> = {};
    if (!draft.targetLevel) e.level = "Please select a target level";
    if (!draft.courseSlug) e.courseSlug = "Please select a course";
    if (!draft.title.trim()) e.title = "Title is required";
    if (!draft.date) e.date = "Please select a date for this challenge";
    if (draft.duration < 1) e.duration = "Duration must be at least 1 minute";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Target Level <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => handleLevelSelect(l)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                draft.targetLevel === l
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
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Course <span className="text-red-400">*</span>
        </label>
        {!readyToFetch ? (
          <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-400">
            Select a level first
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
                : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }`}
          >
            <option value="">
              {courses.length === 0
                ? "No courses found for this level"
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
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Challenge Title <span className="text-red-400">*</span>
        </label>
        <Input
          placeholder="e.g. Thermodynamics Speed Round"
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        {errors.title && (
          <p className="text-xs text-red-400 mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Duration (minutes)
          </label>
          <Input
            type="number"
            min={0}
            max={120}
            step={5}
            value={draft.duration}
            onChange={(e) => onChange({ duration: Number(e.target.value) })}
          />
          {errors.duration && (
            <p className="text-xs text-red-400 mt-1">{errors.duration}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Challenge Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            min={today}
            value={draft.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none transition ${
              errors.date
                ? "border-red-400 focus:ring-2 focus:ring-red-300"
                : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }`}
          />
          {errors.date && (
            <p className="text-xs text-red-400 mt-1">{errors.date}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            {draft.date === today
              ? "🟢 Goes live today"
              : draft.date
                ? `📅 Scheduled for ${draft.date}`
                : ""}
          </p>
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
