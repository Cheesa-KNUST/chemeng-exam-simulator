"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ExamShell from "@/components/exam/ExamShell";
import ExamSidebar from "@/components/exam/ExamSidebar";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";

import { exams } from "@/mock/exams";
import { Clock, AlertCircle } from "lucide-react";

import { saveExamResult } from "@/helpers/exam/exam.service";
import { useAuth } from "@/context/AuthContext";

import { useExamStore } from "@/store/exam.store";

import { useExamSettings } from "@/hooks/useExamSettings";

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;

  const exam = useMemo(() => exams.find((e) => e.id === id), [id]);

  const {
    examId,
    current,
    answers,
    flagged,
    timeLeft,
    isTimeUp,
    isCompleted,
    setExam,
    setTimeLeft,
    setTimeUp,
    setCompleted,
    reset,
    setCurrent,
    setAnswer,
    toggleFlag,
  } = useExamStore();

  const { shuffleQuestions, allowReview } = useExamSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = useMemo(() => {
    if (!exam) return [];

    if (!shuffleQuestions) return exam.questions;

    const shuffled = [...exam.questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, [exam, shuffleQuestions]);

  const safeIndex = Math.min(current, questions.length - 1);
  const question = questions[safeIndex];

  const examIdValue = exam?.id;
  const examDurationSeconds = (exam?.duration ?? 60) * 60;

  useEffect(() => {
    if (!examIdValue) return;

    if (examId !== examIdValue || isCompleted) {
      reset();
      setExam(examIdValue);
      setTimeLeft(examDurationSeconds);
    } else {
      setExam(examIdValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examIdValue]);

  const handleDirectSubmit = useCallback(async () => {
    if (!exam || !uid || isSubmitting) return;

    try {
      setIsSubmitting(true);

      let correct = 0;

      questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });

      const total = questions.length;
      const percent = Math.round((correct / total) * 100);

      await saveExamResult({
        userId: uid,
        examId: exam.id,
        course: exam.title,
        score: percent,
        total,
        correct,
      });

      setCompleted(true);

      const data = encodeURIComponent(JSON.stringify(answers));

      router.push(`/student/results/${exam.id}?data=${data}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [exam, uid, answers, questions, router, setCompleted, isSubmitting]);

  const handleTimeUp = useCallback(async () => {
    if (!exam || !uid) return;

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });

    const total = questions.length;
    const percent = Math.round((correct / total) * 100);

    await saveExamResult({
      userId: uid,
      examId: exam.id,
      course: exam.title,
      score: percent,
      total,
      correct,
    });

    setTimeUp(true);
    setCompleted(true);

    if (allowReview) {
      router.push(`/student/exam/${exam.id}/review`);
    } else {
      handleDirectSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, answers, uid, router, setTimeUp, setCompleted]);

  useEffect(() => {
    if (!timeLeft || isTimeUp) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isTimeUp, handleTimeUp, setTimeLeft]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft > 0 && timeLeft <= 90;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length ?? 0;

  if (!exam) {
    return (
      <ExamShell
        sidebar={
          <ExamSidebar
            total={totalQuestions}
            current={current}
            answers={answers}
            flagged={flagged}
            onJump={setCurrent}
            onSubmit={() => {
              if (allowReview) {
                router.push(`/student/exam/${id}/review`);
              } else {
                handleDirectSubmit();
              }
            }}
            onToggleFlag={toggleFlag}
          />
        }
      >
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-10 justify-center">
          <AlertCircle size={18} />
          <span>Exam not found</span>
        </div>
      </ExamShell>
    );
  }

  const handleAnswer = (value: string) => {
    setAnswer(safeIndex, value);
  };

  return (
    <ExamShell
      sidebar={
        <ExamSidebar
          total={totalQuestions}
          current={current}
          answers={answers}
          flagged={flagged}
          onJump={setCurrent}
          onSubmit={() => {
            if (allowReview) {
              router.push(`/student/exam/${exam.id}/review`);
            } else {
              handleDirectSubmit();
            }
          }}
          onToggleFlag={toggleFlag}
        />
      }
    >
      <PageHeader
        title={exam.title}
        subtitle={`Question ${safeIndex + 1} of ${totalQuestions} · ${answeredCount} answered`}
        action={
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              isLowTime
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Clock size={15} className={isLowTime ? "animate-pulse" : ""} />
            {formatTime(timeLeft)}
          </div>
        }
      />

      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${((safeIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
          Question {safeIndex + 1}
        </p>

        <p className="text-slate-800 dark:text-slate-100 text-base font-medium leading-relaxed mb-6">
          {question.question}
        </p>

        <div className="space-y-3">
          {question.options.map((opt: string, i: number) => {
            const isSelected = answers[safeIndex] === opt;
            const label = String.fromCharCode(65 + i);

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm shadow-blue-100 dark:shadow-none"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-300 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-700/50"
                }`}
              >
                <span
                  className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {label}
                </span>

                <span
                  className={`text-sm leading-snug transition-colors ${
                    isSelected
                      ? "text-blue-700 dark:text-blue-300 font-medium"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100 dark:border-slate-700">
          <Button
            variant="secondary"
            onClick={() => setCurrent(Math.max(0, safeIndex - 1))}
            disabled={safeIndex === 0}
          >
            ← Previous
          </Button>

          <div className="hidden sm:flex items-center gap-1.5">
            {questions.map((_: unknown, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === safeIndex
                    ? "bg-blue-500 w-4"
                    : answers[i]
                      ? "bg-emerald-400 dark:bg-emerald-500"
                      : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>

          {safeIndex === questions.length - 1 ? (
            <Button
              variant="primary"
              onClick={() => {
                if (allowReview) {
                  router.push(`/student/exam/${exam.id}/review`);
                } else {
                  handleDirectSubmit();
                }
              }}
              disabled={isSubmitting}
            >
              {allowReview ? (
                "Review & Submit"
              ) : isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setCurrent(safeIndex + 1)}>
              Next →
            </Button>
          )}
        </div>
      </div>
    </ExamShell>
  );
}
