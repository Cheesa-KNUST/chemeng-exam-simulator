"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ExamMetaStep from "./ExamMetaStep";
import ReviewStep from "./ReviewStep";
import { ExamDraft, ExamQuestion } from "./types";
import { CheckCircle, ChevronRight } from "lucide-react";
import QuestionBuilderStep from "./QuestionBuilderStep";

const STEPS = ["Exam Details", "Add Questions", "Review & Save"];

const emptyDraft = (): ExamDraft => ({
  id: "",
  courseSlug: "",
  title: "",
  duration: 0,
  difficulty: "Easy",
  type: "",
  level: 100,
  semester: 1,
  questions: [],
});

export default function NewExamPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ExamDraft>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateDraft = (patch: Partial<ExamDraft>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const updateQuestions = (questions: ExamQuestion[]) =>
    updateDraft({ questions });

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save exam");
      }
      router.push("/admin/exams");
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="New Exam"
        subtitle="Build and publish a new exam for your students"
      />

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                        ? "bg-blue-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                  }`}
                >
                  {done ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    active
                      ? "text-slate-800 dark:text-slate-100"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight
                  size={16}
                  className="text-slate-300 dark:text-slate-600 mx-1"
                />
              )}
            </div>
          );
        })}
      </div>

      {step === 0 && (
        <ExamMetaStep
          draft={draft}
          onChange={updateDraft}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <QuestionBuilderStep
          questions={draft.questions}
          onChange={updateQuestions}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <ReviewStep
          draft={draft}
          saving={saving}
          saveError={saveError}
          onBack={() => setStep(1)}
          onSave={handleSave}
        />
      )}
    </AppShell>
  );
}
