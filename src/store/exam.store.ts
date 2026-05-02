import { create } from "zustand";
import { persist } from "zustand/middleware";

type ExamSession = {
  examId: string | null;

  current: number;
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  timeLeft: number;
  isTimeUp: boolean;
  isCompleted: boolean;

  questionOrder: number[];
  optionOrder: Record<number, number[]>;

  setExam: (id: string) => void;
  setCurrent: (i: number) => void;
  setAnswer: (i: number, value: string) => void;
  toggleFlag: (i: number) => void;
  setTimeLeft: (value: number | ((prev: number) => number)) => void;
  setTimeUp: (value: boolean) => void;
  setCompleted: (value: boolean) => void;
  setQuestionOrder: (order: number[]) => void;
  setOptionOrder: (order: Record<number, number[]>) => void;
  reset: () => void;
};

export const useExamStore = create<ExamSession>()(
  persist(
    (set) => ({
      examId: null,

      current: 0,
      answers: {},
      flagged: {},
      timeLeft: 0,
      isTimeUp: false,
      isCompleted: false,

      questionOrder: [],
      optionOrder: {},

      setExam: (id) => set({ examId: id }),

      setCurrent: (i) => set({ current: i }),

      setAnswer: (i, value) =>
        set((state) => ({
          answers: { ...state.answers, [i]: value },
        })),

      toggleFlag: (i) =>
        set((state) => ({
          flagged: {
            ...state.flagged,
            [i]: !state.flagged[i],
          },
        })),

      setTimeLeft: (value) =>
        set((state) => ({
          timeLeft: typeof value === "function" ? value(state.timeLeft) : value,
        })),

      setTimeUp: (value) => set({ isTimeUp: value }),

      setCompleted: (value) => set({ isCompleted: value }),

      setQuestionOrder: (order) => set({ questionOrder: order }),

      setOptionOrder: (order) => set({ optionOrder: order }),

      reset: () =>
        set({
          examId: null,
          current: 0,
          answers: {},
          flagged: {},
          timeLeft: 0,
          isTimeUp: false,
          isCompleted: false,
          questionOrder: [],
          optionOrder: {},
        }),
    }),
    {
      name: "exam-session",
    },
  ),
);
