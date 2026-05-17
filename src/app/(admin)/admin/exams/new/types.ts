export type MCQQuestion = {
  id: string;
  kind: "mcq";
  question: string;
  options: string[];
  answer: string;
  image?: string;
};

export type TrueFalseQuestion = {
  id: string;
  kind: "true_false";
  question: string;
  options: ["True", "False"];
  answer: "True" | "False";
};

export type FillInQuestion =
  | {
      id: string;
      kind: "fill_in";
      answerType: "text";
      question: string;
      answer: string;
      options?: never;
    }
  | {
      id: string;
      kind: "fill_in";
      answerType: "number";
      question: string;
      answer: number;
      tolerance?: number;
      options?: never;
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
    };

export type PictorialMCQQuestion = {
  id: string;
  kind: "pictorial_mcq";
  question: string;
  image: string;
  options: string[];
  answer: string;
};

export type ExamQuestion =
  | MCQQuestion
  | TrueFalseQuestion
  | FillInQuestion
  | PictorialMCQQuestion;

export type ExamDraft = {
  id: string;
  courseSlug: string;
  level: number | null;
  semester: number | null;
  title: string;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  type: string;
  questions: ExamQuestion[];
};

export const KIND_LABELS: Record<ExamQuestion["kind"], string> = {
  mcq: "Multiple Choice",
  true_false: "True / False",
  fill_in: "Fill In",
  pictorial_mcq: "Image MCQ",
};
