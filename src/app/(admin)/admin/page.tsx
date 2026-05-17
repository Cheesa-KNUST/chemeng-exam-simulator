"use client";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Users,
  BookOpen,
  ClipboardList,
  Library,
  Download,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Star,
  PlusCircle,
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

const GRADE_COLORS: Record<string, string> = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
};

const TYPE_COLORS: Record<string, string> = {
  pdf: "#ef4444",
  doc: "#3b82f6",
  ppt: "#f97316",
  image: "#a855f7",
  video: "#ec4899",
};

const LEVEL_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ef4444"];

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-start gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {sub}
          </p>
        )}
      </div>
      {href && (
        <ArrowRight
          size={15}
          className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 shrink-0 mt-1 transition-colors"
        />
      )}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-20" />
          <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded w-14" />
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

function SkeletonChart({ height = 200 }: { height?: number }) {
  return (
    <div
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 animate-pulse"
      style={{ height: height + 72 }}
    >
      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-32 mb-4" />
      <div
        className="bg-slate-100 dark:bg-slate-700 rounded-xl"
        style={{ height }}
      />
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 dark:bg-slate-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-700">
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i}>
          {p.name ? `${p.name}: ` : ""}
          {p.value}
        </p>
      ))}
    </div>
  );
}

export default function AdminHomePage() {
  const { data, loading, error } = useAdminDashboard();

  return (
    <AppShell>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and analytics"
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/courses">
              <Button
                variant="secondary"
                className="bg-slate-300 flex items-center"
              >
                <PlusCircle size={16} className="mr-2" />
                New Course
              </Button>
            </Link>
            <Link href="/admin/exams/new">
              <Button variant="primary" className="flex items-center">
                <PlusCircle size={16} className="mr-2" />
                New Exam
              </Button>
            </Link>
          </div>
        }
      />

      {error && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-5">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
              }
              color="bg-blue-50 dark:bg-blue-900/20"
              label="Total Students"
              value={data!.users.total}
              sub="Registered accounts"
              href="/admin/users"
            />
            <StatCard
              icon={
                <ClipboardList
                  size={20}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              }
              color="bg-emerald-50 dark:bg-emerald-900/20"
              label="Exam Attempts"
              value={data!.exams.totalAttempts.toLocaleString()}
              sub="All time submissions"
            />
            <StatCard
              icon={
                <Star
                  size={20}
                  className="text-amber-500 dark:text-amber-400"
                />
              }
              color="bg-amber-50 dark:bg-amber-900/20"
              label="Average Score"
              value={`${data!.exams.avgScore}%`}
              sub="Across all attempts"
            />
            <StatCard
              icon={
                <BookOpen
                  size={20}
                  className="text-purple-600 dark:text-purple-400"
                />
              }
              color="bg-purple-50 dark:bg-purple-900/20"
              label="Total Courses"
              value={data!.courses.total}
              sub={`${data!.exams.totalExams} exams total`}
              href="/admin/courses"
            />
            <StatCard
              icon={
                <Library
                  size={20}
                  className="text-rose-600 dark:text-rose-400"
                />
              }
              color="bg-rose-50 dark:bg-rose-900/20"
              label="Total Materials"
              value={data!.materials.total}
              sub={`${data!.materials.approved} approved`}
              href="/admin/materials"
            />
            <StatCard
              icon={
                <Clock
                  size={20}
                  className="text-orange-500 dark:text-orange-400"
                />
              }
              color="bg-orange-50 dark:bg-orange-900/20"
              label="Pending Review"
              value={data!.materials.pending}
              sub="Student submissions"
              href="/admin/materials"
            />
            <StatCard
              icon={
                <Download
                  size={20}
                  className="text-cyan-600 dark:text-cyan-400"
                />
              }
              color="bg-cyan-50 dark:bg-cyan-900/20"
              label="Total Downloads"
              value={data!.materials.totalDownloads.toLocaleString()}
              sub="Across all materials"
            />
            <StatCard
              icon={
                <TrendingUp
                  size={20}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              }
              color="bg-indigo-50 dark:bg-indigo-900/20"
              label="This Week"
              value={data!.exams.weeklyActivity.reduce(
                (a, b) => a + b.count,
                0,
              )}
              sub="Exam attempts (7 days)"
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-5">
        {loading ? (
          <>
            <SkeletonChart height={200} />
            <SkeletonChart height={200} />
          </>
        ) : (
          <>
            <div className="lg:col-span-2">
              <ChartCard
                title="Exam Activity"
                subtitle="Attempts per day — last 7 days"
              >
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data!.exams.weeklyActivity}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-700"
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-slate-400"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-slate-400"
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ fill: "#3b82f6", r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Attempts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <ChartCard
              title="Score Distribution"
              subtitle="All-time grade breakdown"
            >
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data!.exams.scoreDistribution}
                    dataKey="count"
                    nameKey="grade"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                  >
                    {data!.exams.scoreDistribution.map((entry) => (
                      <Cell
                        key={entry.grade}
                        fill={GRADE_COLORS[entry.grade] ?? "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
                {data!.exams.scoreDistribution.map(({ grade, count }) => (
                  <div key={grade} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: GRADE_COLORS[grade] ?? "#94a3b8" }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {grade}: {count}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        {loading ? (
          <>
            <SkeletonChart height={180} />
            <SkeletonChart height={180} />
          </>
        ) : (
          <>
            <ChartCard
              title="Students by Level"
              subtitle="Registered users grouped by year"
            >
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data!.users.byLevel} barSize={32}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-700"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="level"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400"
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                    {data!.users.byLevel.map((entry, i) => (
                      <Cell
                        key={entry.level}
                        fill={LEVEL_COLORS[i % LEVEL_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Exams per Course"
              subtitle="Top courses by exam count"
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={data!.courses.topCourses}
                  layout="vertical"
                  barSize={16}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 40,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-700"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400"
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="course"
                    width={140}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400"
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Bar
                    dataKey="count"
                    name="Exams"
                    fill="#3b82f6"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {loading ? (
          <>
            <SkeletonChart height={160} />
            <SkeletonChart height={160} />
          </>
        ) : (
          <>
            <ChartCard
              title="Materials by Type"
              subtitle="Breakdown of uploaded file types"
            >
              {!data!.materials.byType?.length ? (
                <div className="h-40 flex flex-col items-center justify-center text-center">
                  <Library
                    size={28}
                    className="text-slate-300 dark:text-slate-600 mb-2"
                  />

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    No materials yet
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Uploaded material statistics will appear here.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={data!.materials.byType} barSize={28}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-700"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="type"
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-slate-400"
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-slate-400"
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar dataKey="count" name="Files" radius={[6, 6, 0, 0]}>
                      {data!.materials.byType.map((entry) => (
                        <Cell
                          key={entry.type}
                          fill={TYPE_COLORS[entry.type] ?? "#94a3b8"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden h-full">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Recent Registrations
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Newest student accounts
                    </p>
                  </div>
                  <Link
                    href="/admin/users"
                    className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-medium transition-colors"
                  >
                    View all <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {data!.users.recent.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-slate-400">
                      No users yet.
                    </p>
                  ) : (
                    data!.users.recent.map((u, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-5 py-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                          <GraduationCap
                            size={15}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {u.username}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Level {u.level} ·{" "}
                            {u.program || "Chemical Engineering"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          {u.createdAt && (
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {new Date(u.createdAt).toLocaleDateString(
                                "en-GB",
                                { day: "numeric", month: "short" },
                              )}
                            </p>
                          )}
                          <div className="flex items-center justify-end gap-1 mt-0.5">
                            <CheckCircle2
                              size={11}
                              className="text-emerald-500"
                            />
                            <span className="text-[11px] text-emerald-500 font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          Quick Actions
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              href: "/admin/courses",
              icon: <BookOpen size={16} className="text-purple-500" />,
              bg: "bg-purple-50 dark:bg-purple-900/20",
              label: "Manage Courses",
              sub: "Add or edit courses",
            },
            {
              href: "/admin/exams",
              icon: <ClipboardList size={16} className="text-blue-500" />,
              bg: "bg-blue-50 dark:bg-blue-900/20",
              label: "Manage Exams",
              sub: "Edit or delete exams",
            },
            {
              href: "/admin/materials",
              icon: <Library size={16} className="text-rose-500" />,
              bg: "bg-rose-50 dark:bg-rose-900/20",
              label: "Reference Materials",
              sub: `${data?.materials.pending ?? "—"} pending review`,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {item.sub}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 shrink-0 transition-colors"
              />
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
