import { ChallengeItem } from "@/mock/challenge";

export type ChallengeDraft = {
  title: string;
  courseSlug: string;
  targetLevel: number | null;
  date: string;
  duration: number;
  items: ChallengeItem[];
};

export const emptyChallengeDraft = (): ChallengeDraft => ({
  title: "",
  courseSlug: "",
  targetLevel: null,
  date: "",
  duration: 15,
  items: [],
});
