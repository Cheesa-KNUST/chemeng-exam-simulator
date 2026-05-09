"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import ExamShell from "@/components/exam/ExamShell";
import ExamSidebar from "@/components/exam/ExamSidebar";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import QuestionRenderer from "@/components/exam/QuestionRenderer";

import { Clock, AlertCircle } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/helpers/exam/exam.service";
import { useRoomExamStore } from "@/store/roomExam.store";
import { deriveQuestions } from "@/helpers/exam/examShuffle";

export default function RoomExamPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;

  const {
    startedAt,
    questionOrder,
    optionOrder,
    current,
    answers,
    flagged,
    isCompleted,
    isSubmitting,
    loadAttempt,
    setCurrent,
    setAnswer,
    toggleFlag,
    setCompleted,
    setSubmitting,
    reset,
  } = useRoomExamStore();

  const [roomExamId, setRoomExamId] = useState<string | null>(null);
  const [allowReview, setAllowReview] = useState(false);
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [error, setError] = useState("");

  const { exam, loading: examLoading } = useExam(roomExamId ?? "");

  useEffect(() => {
    if (!uid) return;

    (async () => {
      try {
        const [attemptRes, roomRes] = await Promise.all([
          fetch(`/api/rooms/${code}/attempt?userId=${uid}`),
          fetch(`/api/rooms/${code}`),
        ]);

        const [attemptBody, roomBody] = await Promise.all([
          attemptRes.json(),
          roomRes.json(),
        ]);

        if (!attemptRes.ok)
          throw new Error(attemptBody.error ?? "Failed to load attempt");
        if (!roomRes.ok)
          throw new Error(roomBody.error ?? "Failed to load room");

        loadAttempt(attemptBody);
        setRoomExamId(roomBody.room?.source?.examId ?? null);
        setAllowReview(roomBody.room?.settings?.allowReview ?? false);

        if (attemptBody.completed) {
          router.replace(`/student/rooms/${code}/results`);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load exam");
      } finally {
        setAttemptLoading(false);
      }
    })();

    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, code]);

  const questions = useMemo(() => {
    if (!exam) return [];
    return deriveQuestions(
      exam,
      questionOrder,
      optionOrder,
      questionOrder.length > 0,
    );
  }, [exam, questionOrder, optionOrder]);

  useEffect(() => {
    if (!startedAt || !exam || isTimeUp || isCompleted) return;

    const durationMs = (exam.duration ?? 60) * 60 * 1000;
    const endTime = new Date(startedAt).getTime() + durationMs;

    const tick = () => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        setIsTimeUp(true);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, exam, isTimeUp, isCompleted]);

  const handleSubmit = useCallback(async () => {
    if (!uid || isSubmitting || isCompleted) return;

    try {
      setSubmitting(true);

      const res = await fetch(`/api/rooms/${code}/attempt`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, answers }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to submit");

      setCompleted(true);
      router.push(`/student/rooms/${code}/results`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  }, [
    uid,
    code,
    answers,
    isSubmitting,
    isCompleted,
    setSubmitting,
    setCompleted,
    router,
  ]);

  useEffect(() => {
    if (isTimeUp && !isCompleted) {
      const t = setTimeout(() => handleSubmit(), 0);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeUp]);

  const handleSubmitOrReview = () => handleSubmit();
  void allowReview;

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const safeIndex = Math.min(current, Math.max(0, questions.length - 1));
  const question = questions[safeIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const isLowTime = timeLeft > 0 && timeLeft <= 90;

  if (attemptLoading || examLoading) {
    return <Loader fullPage size="lg" label="Loading exam..." />;
  }

  if (error || !exam || !question) {
    return (
      <ExamShell
        sidebar={
          <ExamSidebar
            total={0}
            current={0}
            answers={{}}
            flagged={{}}
            onJump={setCurrent}
            onSubmit={() => {}}
            onToggleFlag={toggleFlag}
            disabled
          />
        }
      >
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center space-y-3">
            <AlertCircle
              size={28}
              className="text-slate-400 dark:text-slate-500 mx-auto"
            />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {error || "Exam could not be loaded"}
            </p>
            <Link href={`/student/rooms/${code}`}>
              <Button variant="secondary">Back to lobby</Button>
            </Link>
          </div>
        </div>
      </ExamShell>
    );
  }

  return (
    <ExamShell
      sidebar={
        <ExamSidebar
          total={totalQuestions}
          current={safeIndex}
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
            Previous
          </Button>

          <div className="hidden sm:flex items-center gap-1.5">
            {questions.map((_, i) => (
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
              {isSubmitting ? (
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
              Next
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center mt-4">{error}</p>
      )}
    </ExamShell>
  );
}
