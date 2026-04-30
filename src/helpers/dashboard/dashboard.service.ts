import { ExamResult } from "./dashboard.types";

export async function getDashboardData(userId: string): Promise<ExamResult[]> {
  const res = await fetch(`/api/dashboard?userId=${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
}
