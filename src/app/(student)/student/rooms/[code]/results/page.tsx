"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

import { useAuth } from "@/context/AuthContext";
import { RoomAttempt } from "@/helpers/rooms/room.types";
import { Exam } from "@/mock/exams";
import { deriveQuestions, isAnswerCorrect } from "@/helpers/exam/examShuffle";

import {
  Trophy,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  DoorOpen,
  LayoutList,
} from "lucide-react";

type ResultData = {
  attempt: RoomAttempt;
  exam: Exam;
  allowReview: boolean;
  showLeaderboard: boolean;
};

export default function RoomResultsPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;

  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid) return;

    (async () => {
      try {
        const attemptRes = await fetch(
          `/api/rooms/${code}/attempt?userId=${uid}`,
        );
        const attempt: RoomAttempt = await attemptRes.json();
        if (!attemptRes.ok) throw new Error("Failed to load attempt");
        if (!attempt.completed) {
          router.replace(`/student/rooms/${code}/exam`);
          return;
        }

        const roomRes = await fetch(`/api/rooms/${code}`);
        const roomData = await roomRes.json();
        if (!roomRes.ok) throw new Error("Failed to load room");

        const examId = roomData.room?.source?.examId;
        const allowReview = roomData.room?.settings?.allowReview ?? true;
        const showLeaderboard =
          roomData.room?.settings?.showLeaderboard ?? false;

        const examRes = await fetch(`/api/exams/${examId}`);
        const exam: Exam = await examRes.json();
        if (!examRes.ok) throw new Error("Failed to load exam");

        setData({ attempt, exam, allowReview, showLeaderboard });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [uid, code, router]);

  if (loading) return <Loader fullPage size="lg" label="Loading results..." />;

  if (error || !data) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {error || "Results could not be loaded"}
            </p>
            <Link href={`/student/rooms/${code}`}>
              <Button variant="secondary">Back to lobby</Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const { attempt, exam, allowReview, showLeaderboard } = data;

  const questions = deriveQuestions(
    exam,
    attempt.questionOrder,
    attempt.optionOrder,
    attempt.questionOrder.length > 0,
  );

  const { answers, score, correctCount, totalQuestions, durationSeconds } =
    attempt;

  const percent = score ?? 0;
  const correct = correctCount ?? 0;

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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <AppShell>
      <PageHeader
        title="Your results"
        subtitle={exam.title}
        action={
          <div className="flex items-center gap-2">
            {showLeaderboard && (
              <Button
                variant="primary"
                onClick={() =>
                  router.push(`/student/rooms/${code}/leaderboard`)
                }
              >
                <span className="flex items-center gap-2">
                  <Trophy size={15} />
                  Leaderboard
                </span>
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => router.push(`/student/rooms/${code}`)}
              className="bg-slate-300"
            >
              <span className="flex items-center gap-2">
                <DoorOpen size={15} />
                Lobby
              </span>
            </Button>
          </div>
        }
      />

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
                {correct} / {totalQuestions} correct
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
                  {correct}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                  Wrong
                </p>
                <p className="font-semibold text-red-500 dark:text-red-400">
                  {
                    questions.filter(
                      (q, i) => answers[i] && !isAnswerCorrect(q, answers[i]),
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
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                  Time
                </p>
                <p className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Clock size={12} />
                  {formatDuration(durationSeconds)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {allowReview ? (
        <>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
            <LayoutList size={15} />
            Question review
          </p>

          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const correctAnswer = String(q.answer);
              const correct = isAnswerCorrect(q, userAnswer);
              const skipped = !userAnswer;

              return (
                <div
                  key={i}
                  className={`p-4 border rounded-xl transition-colors ${
                    skipped
                      ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      : correct
                        ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50"
                        : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {skipped ? (
                        <MinusCircle
                          size={18}
                          className="text-slate-400 dark:text-slate-500"
                        />
                      ) : correct ? (
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

                      {q.kind === "pictorial_mcq" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={q.image}
                          alt="Question illustration"
                          className="mt-2 max-h-40 rounded-lg border border-slate-200 dark:border-slate-700 object-contain bg-white dark:bg-slate-900 p-1"
                        />
                      )}

                      <div className="mt-2 flex flex-col gap-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Your answer:{" "}
                          <span
                            className={`font-medium ${
                              skipped
                                ? "text-slate-400 dark:text-slate-500 italic"
                                : correct
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {userAnswer || "Not answered"}
                          </span>
                        </p>

                        {!correct && !skipped && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Correct answer:{" "}
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              {correctAnswer}
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
        </>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
          <LayoutList
            size={22}
            className="text-slate-400 dark:text-slate-500 mx-auto mb-2"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Question review is not enabled for this room
          </p>
        </div>
      )}
    </AppShell>
  );
}
