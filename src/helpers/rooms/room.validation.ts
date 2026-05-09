import { z } from "zod";

export const createRoomSchema = z.object({
  title: z.string().min(3).max(100),

  examId: z.string().min(1),

  settings: z.object({
    shuffleQuestions: z.boolean(),
    shuffleOptions: z.boolean(),
    allowReview: z.boolean(),
    showLeaderboard: z.boolean(),
  }),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  code: z
    .string()
    .length(6)
    .toUpperCase()
    .regex(/^[A-Z2-9]+$/, "Invalid room code format"),

  userId: z.string().min(1),

  displayName: z.string().min(1).max(60),
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
