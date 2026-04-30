"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  data: { name: string; value: number }[];
};

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#64748b",
];

export default function ScoreDistributionChart({ data }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Score Distribution
      </h3>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="h-72 w-full md:w-2/3" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={85}
                innerRadius={45}
                paddingAngle={3}
              >
                {data.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/3 flex flex-col justify-center gap-3">
          {data.map((item, i) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[i % COLORS.length],
                  }}
                />
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  Grade {item.name}
                </span>
              </div>

              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
