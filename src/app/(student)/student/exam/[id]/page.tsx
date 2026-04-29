"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";

import { exams } from "@/mock/exams";

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();

  const exam = useMemo(() => exams.find((e) => e.id === id), [id]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  const handleSubmit = useCallback(() => {
    if (!exam) return;

    router.push(
      `/student/results/${exam.id}?data=${encodeURIComponent(
        JSON.stringify(answers),
      )}`,
    );
  }, [exam, answers, router]);

  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, handleSubmit]);

  if (!exam) {
    return (
      <AppShell>
        <div className="text-white">Exam not found</div>
      </AppShell>
    );
  }

  const question = exam.questions[current];

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [current]: value,
    }));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <AppShell>
      <PageHeader
        title={exam.title}
        subtitle={`Time Remaining: ${formatTime(timeLeft)}`}
      />

      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white text-lg font-semibold mb-4">
          Question {current + 1}
        </h2>

        <p className="text-slate-300 mb-6">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className={`
                w-full text-left p-3 rounded-lg border transition
                ${
                  answers[current] === opt
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-700 hover:border-slate-500"
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            Previous
          </Button>

          {current === exam.questions.length - 1 ? (
            <Button onClick={handleSubmit}>Submit Exam</Button>
          ) : (
            <Button onClick={() => setCurrent((c) => c + 1)}>Next</Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
