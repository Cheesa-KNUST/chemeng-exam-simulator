import clientPromise, { dbName } from "@/lib/mongodb";

import { generateRoomCode } from "./generateRoomCode";
import { CreateRoomInput, JoinRoomInput } from "./room.validation";
import { ExamRoom, RoomParticipant, RoomAttempt } from "./room.types";
import {
  deriveQuestions,
  isAnswerCorrect,
  shuffleIndices,
} from "@/helpers/exam/examShuffle";
import { Exam } from "@/mock/exams";

export async function createRoom(input: CreateRoomInput, creatorId: string) {
  const client = await clientPromise;
  const db = client.db(dbName);

  const room = {
    code: generateRoomCode(),
    title: input.title,
    creatorId,
    mode: "async" as const,
    source: {
      type: "exam" as const,
      examId: input.examId,
    },
    settings: input.settings,
    participantsCount: 0,
    status: "open" as const,
    createdAt: new Date(),
  };

  const result = await db.collection("rooms").insertOne(room);

  return { _id: result.insertedId, ...room };
}

export async function joinRoom(
  input: JoinRoomInput,
): Promise<{ room: ExamRoom; participant: RoomParticipant }> {
  const client = await clientPromise;
  const db = client.db(dbName);

  const room = await db
    .collection<ExamRoom>("rooms")
    .findOne({ code: input.code });

  if (!room) throw new RoomError("Room not found", 404);
  if (room.status === "closed") throw new RoomError("This room is closed", 403);

  const now = new Date();

  const joinResult = await db.collection("roomParticipants").updateOne(
    { roomCode: input.code, userId: input.userId },
    {
      $setOnInsert: {
        roomCode: input.code,
        userId: input.userId,
        displayName: input.displayName,
        status: "joined" as const,
        score: null,
        joinedAt: now,
      },
    },
    { upsert: true },
  );

  if (joinResult.upsertedCount > 0) {
    await db
      .collection("rooms")
      .updateOne({ code: input.code }, { $inc: { participantsCount: 1 } });
  }

  const participant = await db
    .collection<RoomParticipant>("roomParticipants")
    .findOne({ roomCode: input.code, userId: input.userId });

  return { room, participant: participant! };
}

export async function getRoomWithParticipants(code: string) {
  const client = await clientPromise;
  const db = client.db(dbName);

  const room = await db.collection<ExamRoom>("rooms").findOne({ code });

  if (!room) throw new RoomError("Room not found", 404);

  const participants = await db
    .collection<RoomParticipant>("roomParticipants")
    .find({ roomCode: code })
    .sort({ joinedAt: 1 })
    .toArray();

  return { room, participants };
}

export async function startAttempt(
  code: string,
  userId: string,
): Promise<RoomAttempt> {
  const client = await clientPromise;
  const db = client.db(dbName);

  const room = await db.collection<ExamRoom>("rooms").findOne({ code });

  if (!room) throw new RoomError("Room not found", 404);
  if (room.status === "closed") throw new RoomError("This room is closed", 403);

  const participant = await db
    .collection<RoomParticipant>("roomParticipants")
    .findOne({ roomCode: code, userId });

  if (!participant) throw new RoomError("You have not joined this room", 403);

  const existing = await db
    .collection<RoomAttempt>("roomAttempts")
    .findOne({ roomCode: code, userId, completed: false });

  if (existing) return existing;

  const exam = await db
    .collection<Exam>("exams")
    .findOne({ id: room.source.examId });

  if (!exam) throw new RoomError("Exam not found", 404);

  const { shuffleQuestions, shuffleOptions } = room.settings;

  let questionOrder: number[] = [];
  const optionOrder: Record<number, number[]> = {};

  if (shuffleQuestions) {
    questionOrder = shuffleIndices(exam.questions.length);

    questionOrder.forEach((_origIdx, displayIdx) => {
      const q = exam.questions[questionOrder[displayIdx]];
      if (shuffleOptions && q.kind !== "fill_in") {
        optionOrder[displayIdx] = shuffleIndices(q.options.length);
      }
    });
  }

  const now = new Date();

  const attempt: Omit<RoomAttempt, "_id"> = {
    roomCode: code,
    userId,
    answers: {},
    questionOrder,
    optionOrder,
    totalQuestions: exam.questions.length,
    correctCount: null,
    score: null,
    startedAt: now,
    completed: false,
  };

  const result = await db.collection("roomAttempts").insertOne(attempt);

  await db
    .collection("roomParticipants")
    .updateOne(
      { roomCode: code, userId },
      { $set: { status: "in_progress", startedAt: now } },
    );

  return { _id: result.insertedId.toString(), ...attempt };
}

export async function getAttempt(
  code: string,
  userId: string,
): Promise<RoomAttempt> {
  const client = await clientPromise;
  const db = client.db(dbName);

  const attempt = await db
    .collection<RoomAttempt>("roomAttempts")
    .findOne({ roomCode: code, userId });

  if (!attempt) throw new RoomError("No attempt found", 404);

  return attempt;
}

export async function submitAttempt(
  code: string,
  userId: string,
  answers: Record<number, string>,
): Promise<RoomAttempt> {
  const client = await clientPromise;
  const db = client.db(dbName);

  const attempt = await db
    .collection<RoomAttempt>("roomAttempts")
    .findOne({ roomCode: code, userId });

  if (!attempt) throw new RoomError("No attempt found", 404);
  if (attempt.completed) throw new RoomError("Attempt already submitted", 409);

  const room = await db.collection<ExamRoom>("rooms").findOne({ code });

  if (!room) throw new RoomError("Room not found", 404);

  const exam = await db
    .collection<Exam>("exams")
    .findOne({ id: room.source.examId });

  if (!exam) throw new RoomError("Exam not found", 404);

  const questions = deriveQuestions(
    exam,
    attempt.questionOrder,
    attempt.optionOrder,
    room.settings.shuffleQuestions,
  );

  const correctCount = questions.filter((q, i) =>
    isAnswerCorrect(q, answers[i]),
  ).length;

  const score = Math.round((correctCount / questions.length) * 100);

  const now = new Date();
  const durationSeconds = Math.round(
    (now.getTime() - attempt.startedAt.getTime()) / 1000,
  );

  await db.collection("roomAttempts").updateOne(
    { roomCode: code, userId },
    {
      $set: {
        answers,
        correctCount,
        score,
        submittedAt: now,
        durationSeconds,
        completed: true,
      },
    },
  );

  await db.collection("roomParticipants").updateOne(
    { roomCode: code, userId },
    {
      $set: {
        status: "completed",
        score,
        completedAt: now,
      },
    },
  );

  const [totalParticipants, completedParticipants] = await Promise.all([
    db.collection("roomParticipants").countDocuments({ roomCode: code }),
    db
      .collection("roomParticipants")
      .countDocuments({ roomCode: code, status: "completed" }),
  ]);

  if (totalParticipants > 0 && completedParticipants >= totalParticipants) {
    await db
      .collection("rooms")
      .updateOne({ code }, { $set: { status: "closed", closedAt: now } });
  }

  return {
    ...attempt,
    answers,
    correctCount,
    score,
    submittedAt: now,
    durationSeconds,
    completed: true,
  };
}

export class RoomError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "RoomError";
  }
}

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  score: number | null;
  durationSeconds: number | null;
  status: string;
  isCurrentUser: boolean;
};

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  currentUserRank: number | null;
  totalParticipants: number;
  completedCount: number;
};

export async function getLeaderboard(
  code: string,
  requestingUserId?: string,
): Promise<LeaderboardResponse> {
  const client = await clientPromise;
  const db = client.db(dbName);

  const room = await db.collection<ExamRoom>("rooms").findOne({ code });

  if (!room) throw new RoomError("Room not found", 404);

  if (!room.settings.showLeaderboard) {
    throw new RoomError("Leaderboard is not enabled for this room", 403);
  }

  const participants = await db
    .collection<RoomParticipant>("roomParticipants")
    .find({ roomCode: code })
    .toArray();

  const attempts = await db
    .collection<RoomAttempt>("roomAttempts")
    .find({ roomCode: code, completed: true })
    .toArray();

  const durationMap = new Map<string, number>(
    attempts.map((a) => [a.userId, a.durationSeconds ?? Infinity]),
  );

  const sorted = [...participants].sort((a, b) => {
    const aCompleted = a.status === "completed";
    const bCompleted = b.status === "completed";

    if (aCompleted && !bCompleted) return -1;
    if (!aCompleted && bCompleted) return 1;

    if (aCompleted && bCompleted) {
      const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
      if (scoreDiff !== 0) return scoreDiff;

      return (
        (durationMap.get(a.userId) ?? Infinity) -
        (durationMap.get(b.userId) ?? Infinity)
      );
    }

    return a.joinedAt < b.joinedAt ? -1 : 1;
  });

  const entries: LeaderboardEntry[] = sorted.map((p, i) => ({
    rank: i + 1,
    userId: p.userId,
    displayName: p.displayName,
    score: p.score,
    durationSeconds: durationMap.get(p.userId) ?? null,
    status: p.status,
    isCurrentUser: p.userId === requestingUserId,
  }));

  const currentUserEntry = requestingUserId
    ? entries.find((e) => e.userId === requestingUserId)
    : null;

  return {
    entries,
    currentUserRank: currentUserEntry?.rank ?? null,
    totalParticipants: participants.length,
    completedCount: participants.filter((p) => p.status === "completed").length,
  };
}

export async function getRoomsForUser(userId: string) {
  const client = await clientPromise;
  const db = client.db(dbName);

  const created = await db
    .collection<ExamRoom>("rooms")
    .find({ creatorId: userId })
    .sort({ createdAt: -1 })
    .toArray();

  const participations = await db
    .collection<RoomParticipant>("roomParticipants")
    .find({ userId })
    .toArray();

  const joinedCodes = participations
    .map((p) => p.roomCode)
    .filter((code) => !created.find((r) => r.code === code));

  const joined = joinedCodes.length
    ? await db
        .collection<ExamRoom>("rooms")
        .find({ code: { $in: joinedCodes } })
        .sort({ createdAt: -1 })
        .toArray()
    : [];

  return [
    ...created.map((r) => ({ ...r, role: "creator" as const })),
    ...joined.map((r) => ({ ...r, role: "participant" as const })),
  ];
}

export async function closeRoom(
  code: string,
  requestingUserId: string,
): Promise<void> {
  const client = await clientPromise;
  const db = client.db(dbName);

  const room = await db.collection<ExamRoom>("rooms").findOne({ code });

  if (!room) throw new RoomError("Room not found", 404);
  if (room.creatorId !== requestingUserId) {
    throw new RoomError("Only the host can close this room", 403);
  }
  if (room.status === "closed") {
    throw new RoomError("Room is already closed", 409);
  }

  await db
    .collection("rooms")
    .updateOne({ code }, { $set: { status: "closed", closedAt: new Date() } });
}

export async function deleteRoom(
  code: string,
  requestingUserId: string,
): Promise<void> {
  const client = await clientPromise;
  const db = client.db(dbName);

  const room = await db.collection<ExamRoom>("rooms").findOne({ code });

  if (!room) throw new RoomError("Room not found", 404);
  if (room.creatorId !== requestingUserId) {
    throw new RoomError("Only the host can delete this room", 403);
  }
  if (room.status !== "closed") {
    throw new RoomError("Close the room before deleting it", 400);
  }

  await Promise.all([
    db.collection("rooms").deleteOne({ code }),
    db.collection("roomParticipants").deleteMany({ roomCode: code }),
    db.collection("roomAttempts").deleteMany({ roomCode: code }),
  ]);
}
