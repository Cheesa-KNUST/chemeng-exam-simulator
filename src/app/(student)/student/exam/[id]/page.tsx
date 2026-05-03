"use client";

import Link from "next/link";
import { useEffect, useMemo, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ExamShell from "@/components/exam/ExamShell";
import ExamSidebar from "@/components/exam/ExamSidebar";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import QuestionRenderer from "@/components/exam/QuestionRenderer";

import { Clock, AlertCircle } from "lucide-react";

import { saveExamResult, useExam } from "@/helpers/exam/exam.service";
import { useAuth } from "@/context/AuthContext";

import { useExamStore } from "@/store/exam.store";
import { useExamSettings } from "@/hooks/useExamSettings";
import {
  shuffleIndices,
  deriveQuestions,
  isAnswerCorrect,
} from "@/helpers/exam/examShuffle";

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;

  const { exam, loading: examLoading } = useExam(id as string);

  const {
    examId,
    current,
    answers,
    flagged,
    timeLeft,
    isTimeUp,
    isCompleted,
    questionOrder,
    optionOrder,
    setExam,
    setTimeLeft,
    setTimeUp,
    setCompleted,
    reset,
    setCurrent,
    setAnswer,
    toggleFlag,
    setQuestionOrder,
    setOptionOrder,
  } = useExamStore();

  const { shuffleQuestions, allowReview, isSettingsLoaded } = useExamSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const examIdValue = exam?.id;
  const examDurationSeconds = (exam?.duration ?? 60) * 60;

  useEffect(() => {
    if (!examIdValue || !exam || !isSettingsLoaded) return;

    const needsReset = examId !== examIdValue || isCompleted;

    if (needsReset) {
      reset();
      setExam(examIdValue);
      setTimeLeft(examDurationSeconds);
    } else {
      setExam(examIdValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examIdValue, isSettingsLoaded]);

  useEffect(() => {
    if (!examIdValue || !exam || !isSettingsLoaded) return;
    if (examId !== examIdValue) return;
    if (questionOrder.length === exam.questions.length) return;

    if (shuffleQuestions) {
      const qOrder = shuffleIndices(exam.questions.length);
      const oOrder: Record<number, number[]> = {};
      qOrder.forEach((_origIdx, displayIdx) => {
        const q = exam.questions[qOrder[displayIdx]];
        if (q.kind !== "fill_in") {
          oOrder[displayIdx] = shuffleIndices(q.options.length);
        }
      });
      setQuestionOrder(qOrder);
      setOptionOrder(oOrder);
    } else {
      setQuestionOrder([]);
      setOptionOrder({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examIdValue, examId, shuffleQuestions, isSettingsLoaded]);

  const questions = useMemo(() => {
    if (!exam) return [];
    return deriveQuestions(exam, questionOrder, optionOrder, shuffleQuestions);
  }, [exam, questionOrder, optionOrder, shuffleQuestions]);

  const safeIndex = Math.min(current, Math.max(0, questions.length - 1));
  const question = questions[safeIndex];

  const handleDirectSubmit = useCallback(async () => {
    if (!exam || !uid || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const correct = questions.filter((q, i) =>
        isAnswerCorrect(q, answers[i]),
      ).length;
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

    const correct = questions.filter((q, i) =>
      isAnswerCorrect(q, answers[i]),
    ).length;
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
      router.push(
        `/student/results/${exam.id}?data=${encodeURIComponent(JSON.stringify(answers))}`,
      );
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
  const totalQuestions = questions.length;

  const handleSubmitOrReview = () => {
    if (allowReview) {
      router.push(`/student/exam/${exam!.id}/review`);
    } else {
      handleDirectSubmit();
    }
  };

  if (examLoading || !isSettingsLoaded) {
    return <Loader fullPage size="lg" label="Loading exam..." />;
  }

  if (!exam) {
    return (
      <ExamShell
        sidebar={
          <ExamSidebar
            total={0}
            current={current}
            answers={answers}
            flagged={flagged}
            onJump={setCurrent}
            onSubmit={handleSubmitOrReview}
            onToggleFlag={toggleFlag}
            disabled
          />
        }
      >
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <EmptyState
            icon={<AlertCircle size={22} />}
            title="Exam not found"
            description="We couldn't find this exam. It may have been deleted, moved, or you might not have access to it."
            action={
              <Link href="/student/courses">
                <Button variant="primary">Go back to courses</Button>
              </Link>
            }
          />
        </div>
      </ExamShell>
    );
  }

  return (
    <ExamShell
      sidebar={
        <ExamSidebar
          total={totalQuestions}
          current={current}
          answers={answers}
          flagged={flagged}
          onJump={setCurrent}
          onSubmit={handleSubmitOrReview}
          onToggleFlag={toggleFlag}
        />
      }
    >
      <PageHeader
        title={exam.title}
        subtitle={`Question ${safeIndex + 1} of ${totalQuestions} · ${answeredCount} answered`}
        action={
          <div className="flex justify-center sm:justify-end w-full sm:w-auto">
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
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Question {safeIndex + 1}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
            {question.kind === "mcq" && "Multiple Choice"}
            {question.kind === "true_false" && "True / False"}
            {question.kind === "fill_in" && "Fill in"}
            {question.kind === "pictorial_mcq" && "Image Question"}
          </span>
        </div>

        <p className="text-slate-800 dark:text-slate-100 text-base font-medium leading-relaxed mb-6">
          {question.question}
        </p>

        <QuestionRenderer
          question={question}
          questionIndex={safeIndex}
          userAnswer={answers[safeIndex]}
          onAnswer={setAnswer}
        />

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
              onClick={handleSubmitOrReview}
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
