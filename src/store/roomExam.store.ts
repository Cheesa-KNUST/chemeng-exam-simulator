import { create } from "zustand";

type RoomExamSession = {
  attemptId: string | null;
  roomCode: string | null;
  startedAt: Date | null;
  questionOrder: number[];
  optionOrder: Record<number, number[]>;
  totalQuestions: number;

  current: number;
  answers: Record<number, string>;
  flagged: Record<number, boolean>;

  isCompleted: boolean;
  isSubmitting: boolean;

  loadAttempt: (attempt: {
    attemptId: string;
    roomCode: string;
    startedAt: Date;
    questionOrder: number[];
    optionOrder: Record<number, number[]>;
    totalQuestions: number;
    answers: Record<number, string>;
  }) => void;

  setCurrent: (i: number) => void;
  setAnswer: (i: number, value: string) => void;
  toggleFlag: (i: number) => void;
  setCompleted: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  reset: () => void;
};

const initialState = {
  attemptId: null,
  roomCode: null,
  startedAt: null,
  questionOrder: [],
  optionOrder: {},
  totalQuestions: 0,
  current: 0,
  answers: {},
  flagged: {},
  isCompleted: false,
  isSubmitting: false,
};

export const useRoomExamStore = create<RoomExamSession>((set) => ({
  ...initialState,

  loadAttempt: (attempt) =>
    set({
      attemptId: attempt.attemptId,
      roomCode: attempt.roomCode,
      startedAt: attempt.startedAt,
      questionOrder: attempt.questionOrder,
      optionOrder: attempt.optionOrder,
      totalQuestions: attempt.totalQuestions,
      answers: attempt.answers,
      current: 0,
      flagged: {},
      isCompleted: false,
      isSubmitting: false,
    }),

  setCurrent: (i) => set({ current: i }),

  setAnswer: (i, value) =>
    set((state) => ({
      answers: { ...state.answers, [i]: value },
    })),

  toggleFlag: (i) =>
    set((state) => ({
      flagged: { ...state.flagged, [i]: !state.flagged[i] },
    })),

  setCompleted: (value) => set({ isCompleted: value }),

  setSubmitting: (value) => set({ isSubmitting: value }),

  reset: () => set(initialState),
}));
