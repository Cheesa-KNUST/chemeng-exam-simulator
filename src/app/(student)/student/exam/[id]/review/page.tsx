"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import { exams } from "@/mock/exams";
import { useExamStore } from "@/store/exam.store";
import { useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveExamResult } from "@/helpers/exam/exam.service";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Flag,
  AlertTriangle,
  Send,
  ArrowLeft,
} from "lucide-react";

export default function ReviewPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const uid = user?.uid;
  const router = useRouter();

  const exam = exams.find((e) => e.id === id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { answers, flagged, timeLeft, examId, isTimeUp, setCompleted } =
    useExamStore();

  useEffect(() => {
    if (!exam) return;
    if (examId && examId !== exam.id) {
      router.replace(`/student/exam/${exam.id}`);
    }
  }, [exam, examId, router]);

  const handleFinalSubmit = useCallback(async () => {
    if (!exam || !uid || isSubmitting) return;

    try {
      setIsSubmitting(true);

      let correct = 0;

      exam.questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });

      const total = exam.questions.length;
      const percent = Math.round((correct / total) * 100);

      if (!isTimeUp) {
        await saveExamResult({
          userId: uid,
          examId: exam.id,
          course: exam.title,
          score: percent,
          total,
          correct,
        });
      }

      setCompleted(true);

      router.push(
        `/student/results/${exam.id}?data=${encodeURIComponent(
          JSON.stringify(answers),
        )}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [exam, answers, uid, router, isTimeUp, setCompleted, isSubmitting]);

  if (!exam) return null;

  const total = exam.questions.length;
  const answered = Object.keys(answers).length;
  const unanswered = total - answered;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const answeredPercent = Math.round((answered / total) * 100);

  return (
    <div>
      <PageHeader
        title="Review Answers"
        subtitle={`${exam.title} · Verify before submitting`}
      />

      {isTimeUp && (
        <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <AlertTriangle size={18} className="shrink-0" />
          <p className="text-sm font-medium">
            Time&apos;s up — your exam was automatically submitted. Review your
            answers below and confirm.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              Session Summary
            </p>

            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Completion
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {answeredPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    answeredPercent === 100
                      ? "bg-emerald-500"
                      : answeredPercent >= 60
                        ? "bg-blue-500"
                        : "bg-amber-400"
                  }`}
                  style={{ width: `${answeredPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Answered
                  </span>
                </div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {answered}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <XCircle
                    size={15}
                    className="text-red-400 dark:text-red-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Unanswered
                  </span>
                </div>
                <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                  {unanswered}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Flag
                    size={15}
                    className="text-amber-400 dark:text-amber-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Flagged
                  </span>
                </div>
                <span className="text-sm font-semibold text-amber-500 dark:text-amber-400">
                  {flaggedCount}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Clock
                    size={15}
                    className="text-slate-400 dark:text-slate-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Time Left
                  </span>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    isTimeUp
                      ? "text-red-500"
                      : timeLeft <= 60
                        ? "text-amber-500"
                        : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {isTimeUp ? "Expired" : formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={15} />
                Submit
              </>
            )}
          </Button>

          {!isTimeUp && (
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => router.push(`/student/exam/${id}`)}
            >
              <ArrowLeft size={15} />
              Return to Exam
            </Button>
          )}

          {isTimeUp && (
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 px-2">
              The exam session has ended. You can no longer return.
            </p>
          )}
        </div>

        <div className="lg:col-span-2 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
            {total} Questions
          </p>

          {exam.questions.map((q, i) => {
            const userAnswer = answers[i];
            const isFlagged = flagged[i];
            const isAnswered = Boolean(userAnswer);

            return (
              <div
                key={i}
                className={`rounded-2xl border p-5 transition-all ${
                  isFlagged
                    ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10"
                    : isAnswered
                      ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      : "border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-900/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {isAnswered ? (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Answered
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                        <XCircle size={12} />
                        Unanswered
                      </span>
                    )}
                  </div>

                  {isFlagged && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                      <Flag size={10} />
                      Flagged
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed mb-3">
                  {q.question}
                </p>

                <div className="mt-2">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">
                    Your answer
                  </p>
                  <div
                    className={`px-3.5 py-2.5 rounded-xl text-sm border ${
                      isAnswered
                        ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                        : "bg-transparent border-red-200 dark:border-red-800 text-red-400 italic"
                    }`}
                  >
                    {userAnswer || "Not answered"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
