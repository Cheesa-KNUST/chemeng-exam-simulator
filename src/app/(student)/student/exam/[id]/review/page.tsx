"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExamStore } from "@/store/exam.store";
import { useAuth } from "@/context/AuthContext";
import { saveExamResult, useExam } from "@/helpers/exam/exam.service";
import { CheckCircle2, XCircle, Flag, AlertTriangle } from "lucide-react";
import ReviewShell from "@/components/review/ReviewShell";
import Loader from "@/components/ui/Loader";
import { useExamSettings } from "@/hooks/useExamSettings";
import { deriveQuestions } from "@/helpers/exam/examShuffle";

export default function ReviewPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const uid = user?.uid;
  const router = useRouter();

  const { exam, loading: examLoading } = useExam(id as string);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    answers,
    flagged,
    timeLeft,
    examId,
    isTimeUp,
    questionOrder,
    optionOrder,
    setCompleted,
  } = useExamStore();

  const { shuffleQuestions } = useExamSettings();

  const questions = useMemo(() => {
    if (!exam) return [];
    return deriveQuestions(exam, questionOrder, optionOrder, shuffleQuestions);
  }, [exam, questionOrder, optionOrder, shuffleQuestions]);

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
      questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });

      const total = questions.length;
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
        `/student/results/${exam.id}?data=${encodeURIComponent(JSON.stringify(answers))}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    exam,
    questions,
    answers,
    uid,
    router,
    isTimeUp,
    setCompleted,
    isSubmitting,
  ]);

  if (examLoading) {
    return <Loader fullPage size="lg" label="Loading review..." />;
  }

  if (!exam) return null;

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const unanswered = total - answered;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  return (
    <ReviewShell
      examTitle={exam.title}
      answered={answered}
      unanswered={unanswered}
      flaggedCount={flaggedCount}
      total={total}
      timeLeft={timeLeft}
      isTimeUp={isTimeUp}
      isSubmitting={isSubmitting}
      onSubmit={handleFinalSubmit}
      onReturn={() => router.push(`/student/exam/${id}`)}
    >
      {isTimeUp && (
        <div className="flex items-start gap-3.5 px-5 py-4 mb-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-800/60 shadow-sm backdrop-blur transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 shrink-0">
            <AlertTriangle
              size={20}
              className="text-red-600 dark:text-red-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-slate-700 dark:text-red-300">
              Time is up
            </span>
            <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
              Your session ended automatically. You can review your answers
              below before confirming submission.
            </p>
          </div>
        </div>
      )}

      <p className="text-xl font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
        {total} Question{total !== 1 ? "s" : ""}
      </p>

      <div className="space-y-3 w-full">
        {questions.map((q, i) => {
          const userAnswer = answers[i];
          const isFlagged = flagged[i];
          const isAnswered = Boolean(userAnswer);

          const accentStrip = isFlagged
            ? "bg-amber-400"
            : isAnswered
              ? "bg-emerald-400"
              : "bg-red-400";

          const cardSurface = isFlagged
            ? "border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-900/10"
            : isAnswered
              ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              : "border-red-200 dark:border-red-800/50 bg-red-50/40 dark:bg-red-900/10";

          return (
            <div
              key={i}
              className={`rounded-2xl border overflow-hidden transition-colors ${cardSurface}`}
            >
              <div className={`h-5 ${accentStrip}`} />

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-lg font-bold flex items-center justify-center shrink-0 px-5 py-1.5">
                      {i + 1}
                    </span>
                    {isAnswered ? (
                      <span className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 py-1.5">
                        <CheckCircle2 size={11} />
                        Answered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-400 py-1.5">
                        <XCircle size={11} />
                        Not answered
                      </span>
                    )}
                  </div>

                  {isFlagged && (
                    <span className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50 px-5 py-1.5 rounded-full">
                      <Flag size={10} />
                      Flagged
                    </span>
                  )}
                </div>

                <p className="text-md font-medium text-slate-800 dark:text-slate-100 leading-relaxed mb-4">
                  {q.question}
                </p>

                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
                    Your answer
                  </span>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700/60" />
                </div>

                <div
                  className={`px-4 py-3 rounded-xl text-sm border ${
                    isAnswered
                      ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                      : "border-dashed border-red-300 dark:border-red-800/60 text-red-400 dark:text-red-500 italic"
                  }`}
                >
                  {userAnswer || "Not answered"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ReviewShell>
  );
}
