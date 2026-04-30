import { ReactNode } from "react";
import Card from "./Card";

type Trend = {
  value: string;
  positive: boolean;
};

type Props = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: Trend;
  accent?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  accent = "bg-blue-500",
}: Props) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute bottom-0 left-0 w-full h-1 ${accent}`} />

      <div className="flex items-start justify-between pt-1">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800 dark:text-slate-100 tracking-tight">
            {value}
          </h3>

          {trend && (
            <p
              className={`text-xs mt-2 font-medium flex items-center gap-1 ${
                trend.positive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              <span>{trend.positive ? "↑" : "↓"}</span>
              {trend.value} from last session
            </p>
          )}
        </div>

        {icon && (
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
