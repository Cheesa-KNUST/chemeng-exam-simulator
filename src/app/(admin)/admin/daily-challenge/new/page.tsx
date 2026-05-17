"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ChallengeMetaStep from "@/app/(admin)/admin/daily-challenge/ChallengeMetaStep";
import ChallengeBuilderStep from "@/app/(admin)/admin/daily-challenge/ChallengeBuilderStep";
import ChallengeReviewStep from "@/app/(admin)/admin/daily-challenge/ChallengeReviewStep";
import {
  ChallengeDraft,
  emptyChallengeDraft,
} from "@/app/(admin)/admin/daily-challenge/types";
import { ChallengeItem } from "@/mock/challenge";
import { CheckCircle, ChevronRight } from "lucide-react";

const STEPS = ["Challenge Details", "Add Questions", "Review & Publish"];

export default function NewChallengePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ChallengeDraft>(emptyChallengeDraft());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateDraft = (patch: Partial<ChallengeDraft>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const updateItems = (items: ChallengeItem[]) => updateDraft({ items });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/daily-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          courseSlug: draft.courseSlug,
          targetLevel: draft.targetLevel,
          date: draft.date,
          duration: draft.duration,
          items: draft.items,
          createdBy: user.uid,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to publish challenge");
      }

      router.push("/admin/daily-challenge");
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="New Daily Challenge"
        subtitle="Create a timed challenge for a specific level"
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
        <ChallengeMetaStep
          draft={draft}
          onChange={updateDraft}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <ChallengeBuilderStep
          items={draft.items}
          onChange={updateItems}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <ChallengeReviewStep
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
