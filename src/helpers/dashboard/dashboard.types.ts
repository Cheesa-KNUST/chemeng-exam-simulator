import { Timestamp } from "firebase-admin/firestore";

export type ExamResult = {
  id: string;
  userId: string;
  examId: string;
  course: string;
  score: number;
  total: number;
  correct: number;
  createdAt: Timestamp | Date;
};

export type PerformancePoint = {
  name: string;
  score: number;
};

export type DistributionPoint = {
  name: string;
  value: number;
};

export type ActivityPoint = {
  week: string;
  exams: number;
};

export type DashboardStats = {
  courses: number;
  completedExams: number;
  averageScore: number;
};
