"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import type { ExamQuestion } from "@/mock/exams";
import { exams } from "@/mock/exams";
import { CheckCircle2, XCircle, MinusCircle, Trophy } from "lucide-react";
import { useExamSettings } from "@/hooks/useExamSettings";
import { useExamStore } from "@/store/exam.store";
import { deriveQuestions } from "@/helpers/exam/examShuffle";

export default function ResultsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const exam = useMemo(() => exams.find((e) => e.id === id), [id]);
  const raw = searchParams.get("data");
  const answers: Record<number, string> = raw
    ? JSON.parse(decodeURIComponent(raw))
    : {};

  const { showAnswers, shuffleQuestions } = useExamSettings();
  const { questionOrder, optionOrder } = useExamStore();

  const questions = useMemo(() => {
    if (!exam) return [] as ExamQuestion[];
    return deriveQuestions(exam, questionOrder, optionOrder, shuffleQuestions);
  }, [exam, questionOrder, optionOrder, shuffleQuestions]);

  if (!exam) {
    return (
      <AppShell>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-10 justify-center">
          <MinusCircle size={18} />
          <span>Results not found</span>
        </div>
      </AppShell>
    );
  }

  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.answer) score++;
  });

  const percent = Math.round((score / questions.length) * 100);

  const grade =
    percent >= 80
      ? { label: "Excellent", color: "text-emerald-600 dark:text-emerald-400" }
      : percent >= 60
        ? { label: "Good", color: "text-blue-600 dark:text-blue-400" }
        : percent >= 50
          ? { label: "Pass", color: "text-amber-600 dark:text-amber-400" }
          : { label: "Needs Work", color: "text-red-600 dark:text-red-400" };

  const scoreBarColor =
    percent >= 80
      ? "bg-emerald-500"
      : percent >= 60
        ? "bg-blue-500"
        : percent >= 50
          ? "bg-amber-400"
          : "bg-red-500";

  return (
    <AppShell>
      <PageHeader title="Exam Results" subtitle={exam.title} />

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0 mx-auto sm:mx-0">
            <span className={`text-3xl font-bold ${grade.color}`}>
              {percent}%
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {grade.label}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={16} className="text-amber-400" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {score} / {questions.length} correct
              </p>
            </div>

            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex gap-5 mt-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                  Correct
                </p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {score}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                  Wrong
                </p>
                <p className="font-semibold text-red-500 dark:text-red-400">
                  {
                    questions.filter(
                      (q, i) => answers[i] && answers[i] !== q.answer,
                    ).length
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                  Skipped
                </p>
                <p className="font-semibold text-slate-500 dark:text-slate-400">
                  {questions.filter((_, i) => !answers[i]).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
        Question Review
      </p>

      <div className="space-y-3">
        {questions.map((q, i) => {
          const userAnswer = answers[i];
          const correct = q.answer;
          const isCorrect = userAnswer === correct;
          const isSkipped = !userAnswer;

          return (
            <div
              key={i}
              className={`p-4 border rounded-xl transition-colors ${
                isSkipped
                  ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  : isCorrect
                    ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50"
                    : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isSkipped ? (
                    <MinusCircle
                      size={18}
                      className="text-slate-400 dark:text-slate-500"
                    />
                  ) : isCorrect ? (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-500 dark:text-emerald-400"
                    />
                  ) : (
                    <XCircle
                      size={18}
                      className="text-red-500 dark:text-red-400"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug">
                    {i + 1}. {q.question}
                  </p>

                  <div className="mt-2 flex flex-col gap-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your answer:{" "}
                      <span
                        className={`font-medium ${
                          isSkipped
                            ? "text-slate-400 dark:text-slate-500 italic"
                            : isCorrect
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {userAnswer || "Not answered"}
                      </span>
                    </p>

                    {showAnswers && !isCorrect && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Correct answer:{" "}
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {correct}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
