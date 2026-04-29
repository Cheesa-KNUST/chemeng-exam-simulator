"use client";

import { useParams, useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import type { ExamQuestion } from "@/mock/exams";

import { exams } from "@/mock/exams";

export default function ResultsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const exam = exams.find((e) => e.id === id);

  const raw = searchParams.get("data");
  const answers = raw ? JSON.parse(decodeURIComponent(raw)) : {};

  if (!exam) {
    return (
      <AppShell>
        <div className="text-white">Results not found</div>
      </AppShell>
    );
  }

  let score = 0;

  exam.questions.forEach((q: ExamQuestion, i: number) => {
    if (answers[i] === q.answer) {
      score++;
    }
  });

  const percent = Math.round((score / exam.questions.length) * 100);

  return (
    <AppShell>
      <PageHeader
        title="Exam Results"
        subtitle={`${exam.title} — You scored ${percent}%`}
      />

      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-white text-lg font-semibold">
          Score: {score} / {exam.questions.length}
        </p>

        <p className="text-slate-400 mt-2">Percentage: {percent}%</p>
      </div>

      <div className="mt-6 space-y-4">
        {exam.questions.map((q: ExamQuestion, i: number) => {
          const userAnswer = answers[i];
          const correct = q.answer;

          const isCorrect = userAnswer === correct;

          return (
            <div
              key={i}
              className="p-4 border rounded-xl bg-slate-900 border-slate-800"
            >
              <p className="text-white font-medium">{q.question}</p>

              <p className="text-sm mt-2 text-slate-400">
                Your answer:{" "}
                <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                  {userAnswer || "Not answered"}
                </span>
              </p>

              {!isCorrect && (
                <p className="text-sm text-green-400 mt-1">
                  Correct: {correct}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
