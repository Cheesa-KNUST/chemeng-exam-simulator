export type RoomSettings = {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  showLeaderboard: boolean;
};

export type RoomSource = {
  type: "exam";
  examId: string;
};

export type ExamRoom = {
  _id?: string;
  code: string;
  title: string;
  creatorId: string;
  mode: "async";
  source: RoomSource;
  settings: RoomSettings;
  participantsCount: number;
  status: "open" | "closed";
  createdAt: Date;
  role?: "creator" | "participant";
  closedAt?: Date;
};

export type ParticipantStatus = "joined" | "in_progress" | "completed";

export type RoomParticipant = {
  _id?: string;
  roomCode: string;
  userId: string;
  displayName: string;
  status: ParticipantStatus;
  score: number | null;
  joinedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
};

export type RoomAttempt = {
  _id?: string;
  roomCode: string;
  userId: string;
  answers: Record<number, string>;
  questionOrder: number[];
  optionOrder: Record<number, number[]>;
  totalQuestions: number;
  correctCount: number | null;
  score: number | null;
  startedAt: Date;
  submittedAt?: Date;
  durationSeconds?: number;
  completed: boolean;
};
