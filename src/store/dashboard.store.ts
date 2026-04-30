import { create } from "zustand";
import { ExamResult } from "@/helpers/dashboard/dashboard.types";
import { getDashboardData } from "@/helpers/dashboard/dashboard.service";

type DashboardState = {
  data: ExamResult[];
  loading: boolean;
  error: string | null;
  fetchDashboard: (userId: string) => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchDashboard: async (userId) => {
    set({ loading: true, error: null });

    try {
      const data = await getDashboardData(userId);
      set({ data, loading: false });
    } catch (err: unknown) {
      let message = "Failed to load";

      if (err instanceof Error) {
        message = err.message;
      }

      set({
        error: message,
        loading: false,
      });
    }
  },
}));
