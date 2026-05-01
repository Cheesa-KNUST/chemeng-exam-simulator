"use client";

import { ReactNode } from "react";
import ReviewSidebar from "./ReviewSidebar";
import ReviewHeader from "./ReviewHeader";
import { Send, ArrowLeft } from "lucide-react";

type ReviewShellProps = {
  children: ReactNode;
  examTitle: string;
  answered: number;
  unanswered: number;
  flaggedCount: number;
  total: number;
  timeLeft: number;
  isTimeUp: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onReturn: () => void;
};

export default function ReviewShell({
  children,
  examTitle,
  answered,
  unanswered,
  flaggedCount,
  total,
  timeLeft,
  isTimeUp,
  isSubmitting,
  onSubmit,
  onReturn,
}: ReviewShellProps) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-900 min-h-screen">
      <div className="hidden lg:block h-screen sticky top-0 shrink-0">
        <ReviewSidebar
          examTitle={examTitle}
          answered={answered}
          unanswered={unanswered}
          flaggedCount={flaggedCount}
          total={total}
          timeLeft={timeLeft}
          isTimeUp={isTimeUp}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onReturn={onReturn}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <ReviewHeader
          examTitle={examTitle}
          answered={answered}
          total={total}
          timeLeft={timeLeft}
          isTimeUp={isTimeUp}
        />
        <main className="p-4 md:p-6 flex-1">{children}</main>

        <div className="lg:hidden shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-3">
          {!isTimeUp ? (
            <button
              onClick={onReturn}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={14} />
              Return to Exam
            </button>
          ) : (
            <div className="flex items-start justify-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60">
              <p className="text-md font-bold text-red-500 dark:text-red-400 leading-relaxed">
                Session ended
              </p>
            </div>
          )}

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              </>
            ) : (
              <>
                <Send size={14} />
                Confirm & Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
