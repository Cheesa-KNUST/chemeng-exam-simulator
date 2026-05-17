"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import ExamMetaStep from "../../new/ExamMetaStep";
import QuestionBuilderStep from "../../new/QuestionBuilderStep";
import ReviewStep from "../../new/ReviewStep";
import { ExamDraft, ExamQuestion } from "../../new/types";
import { CheckCircle, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";

const STEPS = ["Exam Details", "Edit Questions", "Review & Save"];

export default function EditExamPage() {
  const { id } = useParams();
  const router = useRouter();

  const [draft, setDraft] = useState<ExamDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/exams/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setDraft({
          id: data.id,
          courseSlug: data.courseSlug,
          title: data.title,
          duration: data.duration,
          difficulty: data.difficulty,
          type: data.type,
          level: data.level,
          semester: data.semester,
          questions: data.questions,
        });
      } catch {
        setDraft(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const updateDraft = (patch: Partial<ExamDraft>) =>
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));

  const updateQuestions = (questions: ExamQuestion[]) =>
    updateDraft({ questions });

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveError(null);
    try {
      const { id: examId, ...updatable } = draft;
      const res = await fetch(`/api/exams/${examId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatable),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }
      router.push("/admin/exams");
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage size="lg" label="Loading exam..." />;

  if (!draft) {
    return (
      <AppShell>
        <EmptyState
          icon={<AlertCircle size={22} />}
          title="Exam not found"
          description="This exam may have been deleted."
          action={
            <Link href="/admin/exams">
              <Button variant="primary">Back to Exams</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Edit Exam" subtitle={draft.title} />

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
