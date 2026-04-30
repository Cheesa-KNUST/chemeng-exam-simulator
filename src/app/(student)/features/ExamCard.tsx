import { getScoreColor, getProgressBarColor } from "./dashboardUtils";

export default function ExamCard({ exam }: { exam: any }) {
  const percent = Math.round((exam.correct / exam.total) * 100);

  return (
    <div
      className="
      relative flex flex-col justify-between
      bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700
      rounded-2xl p-5
      transition-all duration-200 ease-out
      hover:border-slate-300 dark:hover:border-slate-600
      hover:-translate-y-0.5
    "
    >
      <div className="flex items-start justify-between mb-4">
        <h3
          className="
          text-sm font-medium
          text-slate-800 dark:text-slate-100
          line-clamp-1 pr-3
        "
        >
          {exam.course}
        </h3>

        <div
          className={`
            h-2.5 w-2.5 rounded-full shrink-0 mt-1
            ${getScoreColor(exam.score)}
          `}
        />
      </div>

      <div
        className="
        bg-slate-50 dark:bg-slate-900/50
        border border-slate-200 dark:border-slate-700
        rounded-xl p-4
      "
      >
        <div className="flex items-end justify-between mb-3">
          <span
            className="
            text-xs font-medium uppercase tracking-wider
            text-slate-500 dark:text-slate-400
          "
          >
            Score
          </span>

          <span
            className="
            text-lg font-semibold
            text-slate-800 dark:text-slate-100
          "
          >
            {exam.score}%
          </span>
        </div>

        <div
          className="
          h-2 w-full rounded-full overflow-hidden
          bg-slate-200 dark:bg-slate-700
          mb-3
        "
        >
          <div
            className={`
              h-full transition-all duration-500 ease-out
              ${getProgressBarColor(exam.score)}
            `}
            style={{ width: `${exam.score}%` }}
          />
        </div>

        <div
          className="
          flex items-center justify-between text-xs
          text-slate-500 dark:text-slate-400
        "
        >
          <span
            className="
            px-2 py-1 rounded-md
            bg-slate-100 dark:bg-slate-800
            border border-slate-200 dark:border-slate-700
          "
          >
            {exam.correct} / {exam.total} correct
          </span>

          <span>{percent}% accuracy</span>
        </div>
      </div>
    </div>
  );
}
