"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DailyChallenge,
  ChallengeAnswer,
  ChallengeQuestion,
  PreambleBlock,
} from "@/mock/challenge";
import { AlertCircle, Clock, Flame } from "lucide-react";
import Image from "next/image";
import ExamShell from "@/components/exam/ExamShell";
import ChallengeSidebar from "@/components/dailychallenge/ChallengeSidebar";

function useTimer(durationMinutes: number, onExpire: () => void) {
  const [elapsed, setElapsed] = useState(0);
  const total = durationMinutes * 60;
  const remaining = total - elapsed;

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= total) {
          clearInterval(id);
          onExpire();
          return total;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const pct = Math.max(0, (remaining / total) * 100);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const label = `${m}:${s.toString().padStart(2, "0")}`;
  const urgent = remaining <= 60;

  return { elapsed, label, pct, urgent };
}

function PreambleCard({ item }: { item: PreambleBlock }) {
  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">
        Read carefully
      </p>
      {item.image && (
        <div className="mb-3 rounded-xl overflow-hidden">
          <Image
            src={item.image}
            alt="Preamble diagram"
            width={600}
            height={300}
            className="w-full object-contain"
          />
        </div>
      )}
      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
        {item.content}
      </p>
    </div>
  );
}

function QuestionCard({
  item,
  index,
  answer,
  onChange,
  underPreamble,
  isActive,
  questionRef,
}: {
  item: ChallengeQuestion;
  index: number;
  answer: ChallengeAnswer | undefined;
  onChange: (a: ChallengeAnswer) => void;
  underPreamble: boolean;
  isActive: boolean;
  questionRef?: (el: HTMLDivElement | null) => void;
}) {
  const selectedMCQ =
    answer?.kind === "mcq" ||
    answer?.kind === "pictorial_mcq" ||
    answer?.kind === "true_false"
      ? answer.selected
      : null;

  const selectedMulti = answer?.kind === "multi_select" ? answer.selected : [];
  const fillValue = answer?.kind === "fill_in" ? String(answer.value) : "";

  return (
    <div
      ref={questionRef}
      className={`rounded-2xl border p-6 transition-all ${
        underPreamble
          ? "ml-4 border-l-4 border-l-blue-300 dark:border-l-blue-700 rounded-l-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          : isActive
            ? "bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-700 shadow-md shadow-blue-500/10"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Question {index}
        </p>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
            item.kind === "mcq"
              ? "bg-sky-100 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400"
              : item.kind === "pictorial_mcq"
                ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                : item.kind === "true_false"
                  ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                  : item.kind === "fill_in"
                    ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                    : "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
          }`}
        >
          {item.kind === "mcq" && "Multiple Choice"}
          {item.kind === "pictorial_mcq" && "Image MCQ"}
          {item.kind === "true_false" && "True / False"}
          {item.kind === "fill_in" && "Fill In"}
          {item.kind === "multi_select" && "Multi-Select"}
        </span>
      </div>

      {(item.kind === "pictorial_mcq" ||
        (item.kind === "mcq" && item.image)) && (
        <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <Image
            src={(item as { image: string }).image}
            alt="Question diagram"
            width={500}
            height={300}
            className="w-full max-h-64 object-contain bg-white dark:bg-slate-900 p-2"
          />
        </div>
      )}

      <p className="text-slate-800 dark:text-slate-100 text-base font-medium leading-relaxed mb-5">
        {item.question}
      </p>

      {(item.kind === "mcq" ||
        item.kind === "pictorial_mcq" ||
        item.kind === "true_false") && (
        <div className="space-y-3">
          {item.options.map((opt, i) => {
            const isSelected = selectedMCQ === opt;
            const label =
              item.kind === "true_false" ? opt : String.fromCharCode(65 + i);
            return (
              <button
                key={opt}
                onClick={() =>
                  onChange({
                    kind: item.kind as "mcq" | "pictorial_mcq" | "true_false",
                    selected: opt,
                  })
                }
                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm"
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
                  className={`text-sm leading-snug ${
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
      )}

      {item.kind === "multi_select" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
            Select all that apply
          </p>
          {item.options.map((opt, i) => {
            const active = selectedMulti.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => {
                  const next = active
                    ? selectedMulti.filter((s) => s !== opt)
                    : [...selectedMulti, opt];
                  onChange({ kind: "multi_select", selected: next });
                }}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  active
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-purple-300 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-700/50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                    active
                      ? "bg-purple-500 border-purple-500"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {active && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
                      <path
                        d="M1 4l3 3 5-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${
                    active
                      ? "bg-purple-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span
                  className={`text-sm leading-snug ${
                    active
                      ? "text-purple-700 dark:text-purple-300 font-medium"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {item.kind === "fill_in" && (
        <input
          type={
            item.answerType === "number" || item.answerType === "range"
              ? "number"
              : "text"
          }
          placeholder={
            item.answerType === "number" || item.answerType === "range"
              ? "Enter a number…"
              : "Type your answer…"
          }
          value={fillValue}
          onChange={(e) =>
            onChange({
              kind: "fill_in",
              value:
                item.answerType === "number" || item.answerType === "range"
                  ? Number(e.target.value)
                  : e.target.value,
            })
          }
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition placeholder:text-slate-400"
        />
      )}
    </div>
  );
}

export default function DailyChallengePage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const router = useRouter();

  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, ChallengeAnswer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const startedAt = useRef<number | null>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!user || !profile?.level) return;
    fetch(`/api/daily-challenge?level=${Number(profile.level)}&uid=${user.uid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "completed") {
          router.replace(`/student/daily-challenge/${id}/results`);
          return;
        }
        if (
          data.status === "none" ||
          !data.challenge ||
          data.challenge.id !== id
        ) {
          router.replace("/student");
          return;
        }
        setChallenge(data.challenge);
        setLoading(false);
      })
      .catch(() => router.replace("/student"));
  }, [user, profile, id, router]);

  const handleSubmit = async (autoSubmit = false) => {
    if (!challenge || !user || !profile) return;
    setSubmitting(true);
    setSubmitError(null);

    const timeTaken = Math.round(
      (Date.now() - (startedAt.current ?? Date.now())) / 1000,
    );

    try {
      const res = await fetch("/api/daily-challenge/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          username: profile.username,
          challengeId: challenge.id,
          answers,
          timeTaken,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Submission failed");
      }

      router.push(`/student/daily-challenge/${challenge.id}/results`);
    } catch (e) {
      if (!autoSubmit) {
        setSubmitError(e instanceof Error ? e.message : "Unexpected error");
      }
      setSubmitting(false);
    }
  };

  const { label, pct, urgent } = useTimer(challenge?.duration ?? 15, () => {
    setExpired(true);
    handleSubmit(true);
  });

  const handleJump = (questionId: string) => {
    setActiveQuestionId(questionId);
    const el = questionRefs.current[questionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (loading || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const preambleMap = new Map<string, PreambleBlock>(
    challenge.items
      .filter((i): i is PreambleBlock => i.kind === "preamble")
      .map((p) => [p.groupId, p]),
  );

  const preambles = [...preambleMap.values()];

  const allQuestions = challenge.items.filter(
    (i): i is ChallengeQuestion => i.kind !== "preamble",
  );

  const answeredCount = allQuestions.filter(
    (q) => answers[q.id] !== undefined,
  ).length;

  const questionIndexMap = new Map(allQuestions.map((q, i) => [q.id, i + 1]));
  const currentIndex = activeQuestionId
    ? allQuestions.findIndex((q) => q.id === activeQuestionId)
    : 0;

  const sidebar = (
    <ChallengeSidebar
      questions={allQuestions}
      preambles={preambles}
      current={currentIndex}
      answers={answers}
      timeLabel={label}
      urgent={urgent}
      submitting={submitting || expired}
      onJump={handleJump}
      onSubmit={() => handleSubmit(false)}
    />
  );

  return (
    <ExamShell sidebar={sidebar}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={18} className="text-orange-500" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {challenge.title}
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {answeredCount} of {allQuestions.length} answered &middot;{" "}
          {challenge.duration} min
        </p>

        <div className="mt-3 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              urgent ? "bg-red-500" : "bg-orange-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {challenge.items.map((item) => {
          if (item.kind === "preamble") {
            return <PreambleCard key={item.id} item={item} />;
          }

          const q = item as ChallengeQuestion;
          const linkedPreambleId = (q as { preambleId?: string }).preambleId;
          const isUnderPreamble = !!(
            linkedPreambleId && preambleMap.has(linkedPreambleId)
          );

          return (
            <QuestionCard
              key={q.id}
              item={q}
              index={questionIndexMap.get(q.id) ?? 0}
              answer={answers[q.id]}
              onChange={(a) => setAnswers((prev) => ({ ...prev, [q.id]: a }))}
              underPreamble={isUnderPreamble}
              isActive={activeQuestionId === q.id}
              questionRef={(el) => {
                questionRefs.current[q.id] = el;
              }}
            />
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        {submitError && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
            <AlertCircle size={14} />
            {submitError}
          </div>
        )}
        {expired && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
            <Clock size={14} />
            Time&apos;s up! Submitting your answers...
          </div>
        )}
      </div>
    </ExamShell>
  );
}
