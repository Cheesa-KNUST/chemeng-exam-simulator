export type MCQQuestion = {
  id: string;
  kind: "mcq";
  question: string;
  options: string[];
  answer: string;
  image?: string;
  preambleId?: string;
};

export type TrueFalseQuestion = {
  id: string;
  kind: "true_false";
  question: string;
  options: ["True", "False"];
  answer: "True" | "False";
  preambleId?: string;
};

export type FillInQuestion =
  | {
      id: string;
      kind: "fill_in";
      answerType?: "text";
      question: string;
      answer: string;
      options?: never;
      preambleId?: string;
    }
  | {
      id: string;
      kind: "fill_in";
      answerType: "number";
      question: string;
      answer: number;
      tolerance?: number;
      options?: never;
      preambleId?: string;
    }
  | {
      id: string;
      kind: "fill_in";
      answerType: "range";
      question: string;
      answerMin: number;
      answerMax: number;
      answer: string;
      options?: never;
      preambleId?: string;
    }
  | {
      id: string;
      kind: "fill_in";
      answerType: "multi_text";
      question: string;
      acceptedAnswers: string[];
      answer: string;
      options?: never;
      preambleId?: string;
    };

export type PictorialMCQQuestion = {
  id: string;
  kind: "pictorial_mcq";
  question: string;
  image: string;
  options: string[];
  answer: string;
  preambleId?: string;
};

export type PreambleBlock = {
  id: string;
  kind: "preamble";
  content: string;
  image?: string;
  groupId: string;
};

export type MultiSelectQuestion = {
  id: string;
  kind: "multi_select";
  question: string;
  options: string[];
  answers: string[];
  image?: string;
  preambleId?: string;
};

export type ExamQuestion =
  | MCQQuestion
  | TrueFalseQuestion
  | FillInQuestion
  | PictorialMCQQuestion;

export type ChallengeItem =
  | PreambleBlock
  | MCQQuestion
  | TrueFalseQuestion
  | FillInQuestion
  | PictorialMCQQuestion
  | MultiSelectQuestion;

export type ChallengeQuestion = Exclude<ChallengeItem, PreambleBlock>;

export const EXAM_KIND_LABELS: Record<ExamQuestion["kind"], string> = {
  mcq: "Multiple Choice",
  true_false: "True / False",
  fill_in: "Fill In",
  pictorial_mcq: "Image MCQ",
};

export const CHALLENGE_KIND_LABELS: Record<ChallengeItem["kind"], string> = {
  preamble: "Preamble",
  mcq: "Multiple Choice",
  true_false: "True / False",
  fill_in: "Fill In",
  pictorial_mcq: "Image MCQ",
  multi_select: "Multi-Select",
};

export type DailyChallenge = {
  id: string;
  title: string;
  courseSlug: string;
  targetLevel: number;
  date: string;
  duration: number;
  items: ChallengeItem[];
  createdAt: string;
  createdBy: string;
};

export type ChallengeAnswer =
  | { kind: "mcq" | "pictorial_mcq" | "true_false"; selected: string }
  | { kind: "multi_select"; selected: string[] }
  | { kind: "fill_in"; value: string | number };

export type DailyAttempt = {
  id: string;
  uid: string;
  username: string;
  challengeId: string;
  date: string;
  level: number;
  score: number;
  correct: number;
  total: number;
  timeTaken: number;
  answers: Record<string, ChallengeAnswer>;
  submittedAt: string;
};

export type UserStreak = {
  uid: string;
  currentStreak: number;
  longestStreak: number;
  lastChallengeDate: string | null;
};

export type LeaderboardEntry = {
  rank: number;
  uid: string;
  username: string;
  score: number;
  timeTaken: number;
  submittedAt: string;
};

export type DailyChallengeResponse =
  | {
      status: "available";
      challenge: DailyChallenge;
      attemptedToday: false;
      nextChallengeAt: string | null;
    }
  | {
      status: "completed";
      challenge: DailyChallenge;
      attemptedToday: true;
      attempt: DailyAttempt;
      nextChallengeAt: string | null;
    }
  | {
      status: "none";
      nextChallengeAt: string | null;
    };

export type LeaderboardResponse = {
  challengeId: string;
  date: string;
  entries: LeaderboardEntry[];
  totalAttempts: number;
  userEntry: LeaderboardEntry | null;
};

export function scoreQuestion(
  question: ChallengeQuestion,
  answer: ChallengeAnswer,
): number {
  switch (question.kind) {
    case "mcq":
    case "pictorial_mcq":
    case "true_false": {
      if (
        answer.kind !== "mcq" &&
        answer.kind !== "pictorial_mcq" &&
        answer.kind !== "true_false"
      )
        return 0;
      return answer.selected === question.answer ? 1 : 0;
    }
    case "multi_select": {
      if (answer.kind !== "multi_select") return 0;
      const correct = question.answers;
      const selected = answer.selected;
      const correctHits = selected.filter((s) => correct.includes(s)).length;
      const wrongHits = selected.filter((s) => !correct.includes(s)).length;
      return Math.max(0, (correctHits - wrongHits) / correct.length);
    }
    case "fill_in": {
      if (answer.kind !== "fill_in") return 0;
      const val = answer.value;
      if (question.answerType === "number") {
        const tolerance = question.tolerance ?? 0;
        return Math.abs(Number(val) - question.answer) <= tolerance ? 1 : 0;
      }
      if (question.answerType === "range") {
        const num = Number(val);
        return num >= question.answerMin && num <= question.answerMax ? 1 : 0;
      }
      if (question.answerType === "multi_text") {
        const normalized = String(val).trim().toLowerCase();
        return question.acceptedAnswers.some(
          (a) => a.trim().toLowerCase() === normalized,
        )
          ? 1
          : 0;
      }
      return String(val).trim().toLowerCase() ===
        String(question.answer).trim().toLowerCase()
        ? 1
        : 0;
    }
  }
}

export function scoreChallenge(
  items: ChallengeItem[],
  answers: Record<string, ChallengeAnswer>,
): { score: number; correct: number; total: number } {
  const questions = items.filter(
    (item): item is ChallengeQuestion => item.kind !== "preamble",
  );
  if (questions.length === 0) return { score: 0, correct: 0, total: 0 };

  let weightedCorrect = 0;
  for (const q of questions) {
    const answer = answers[q.id];
    if (!answer) continue;
    weightedCorrect += scoreQuestion(q, answer);
  }

  return {
    score: Math.round((weightedCorrect / questions.length) * 100),
    correct: Math.round(weightedCorrect * 10) / 10,
    total: questions.length,
  };
}
