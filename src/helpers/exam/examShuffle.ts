import type { Exam, ExamQuestion } from "@/mock/exams";

export function shuffleIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export type DerivedQuestion = ExamQuestion;

export function deriveQuestions(
  exam: Exam,
  questionOrder: number[],
  optionOrder: Record<number, number[]>,
  shuffleEnabled: boolean,
): DerivedQuestion[] {
  if (!shuffleEnabled || questionOrder.length !== exam.questions.length) {
    return exam.questions.map((q) => ({ ...q }));
  }

  return questionOrder.map((origQIdx, displayIdx) => {
    const orig = exam.questions[origQIdx];

    if (orig.kind === "fill_in") {
      return orig;
    }

    const optIdxs = optionOrder[displayIdx];
    const shuffledOptions =
      optIdxs && optIdxs.length === orig.options.length
        ? (optIdxs.map((oi) => orig.options[oi]) as typeof orig.options)
        : orig.options;

    return { ...orig, options: shuffledOptions } as ExamQuestion;
  });
}

export function isAnswerCorrect(
  question: DerivedQuestion,
  userAnswer: string | undefined,
): boolean {
  if (!userAnswer) return false;

  if (question.kind === "fill_in") {
    if (question.answerType === "number") {
      const parsed = parseFloat(userAnswer.trim());
      if (isNaN(parsed)) return false;
      const tol = question.tolerance ?? 0;
      return Math.abs(parsed - question.answer) <= tol;
    }

    if (question.answerType === "range") {
      const parsed = parseFloat(userAnswer.trim());
      if (isNaN(parsed)) return false;
      return parsed >= question.answerMin && parsed <= question.answerMax;
    }

    return (
      userAnswer.trim().toLowerCase() ===
      String(question.answer).trim().toLowerCase()
    );
  }

  return userAnswer === question.answer;
}
