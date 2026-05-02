import type { Exam, ExamQuestion } from "@/mock/exams";

export function shuffleIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export type DerivedQuestion = ExamQuestion & {
  answer: string;
  options: string[];
};

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
    const optIdxs = optionOrder[displayIdx];

    const options =
      optIdxs && optIdxs.length === orig.options.length
        ? optIdxs.map((oi) => orig.options[oi])
        : orig.options;

    return {
      ...orig,
      options,
    };
  });
}
