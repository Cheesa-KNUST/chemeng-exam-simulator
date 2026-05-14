"use client";

import { useEffect, useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import {
  Users,
  Search,
  GraduationCap,
  Shield,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Copy,
  Check,
  X,
} from "lucide-react";

type AdminUser = {
  uid: string;
  username: string;
  email: string;
  level: string;
  isAdmin: boolean;
  createdAt: string | null;
  examCount: number;
  avgScore: number | null;
};

type SortKey = "username" | "level" | "createdAt" | "examCount" | "avgScore";
type SortDir = "asc" | "desc";

const LEVEL_OPTIONS = ["all", "100", "200", "300", "400"];

const SCORE_COLOR = (score: number | null) => {
  if (score === null) return "text-slate-400 dark:text-slate-500";
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
};

function SortIcon({
  column,
  active,
  dir,
}: {
  column: SortKey;
  active: SortKey;
  dir: SortDir;
}) {
  if (active !== column)
    return (
      <ChevronsUpDown
        size={12}
        className="text-slate-300 dark:text-slate-600"
      />
    );
  return dir === "asc" ? (
    <ChevronUp size={12} className="text-blue-500" />
  ) : (
    <ChevronDown size={12} className="text-blue-500" />
  );
}

function TH({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
  className = "",
}: {
  label: string;
  col?: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (col: SortKey) => void;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap ${col ? "cursor-pointer select-none hover:text-slate-600 dark:hover:text-slate-300" : ""} ${className}`}
      onClick={col ? () => onSort(col) : undefined}
    >
      <div className="flex items-center gap-1.5">
        {label}
        {col && <SortIcon column={col} active={sortKey} dir={sortDir} />}
      </div>
    </th>
  );
}

function CopyUid({ uid }: { uid: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors group"
      title="Copy UID"
    >
      <span className="truncate max-w-22.5">{uid}</span>
      {copied ? (
        <Check size={11} className="text-emerald-500 shrink-0" />
      ) : (
        <Copy
          size={11}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}
    </button>
  );
}

function UserDrawer({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            User Details
          </p>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 px-5 py-8 border-b border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            {user.isAdmin ? (
              <Shield size={28} className="text-blue-600 dark:text-blue-400" />
            ) : (
              <GraduationCap
                size={28}
                className="text-blue-600 dark:text-blue-400"
              />
            )}
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-800 dark:text-slate-100">
              {user.username}
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              {user.email}
            </p>
            {user.isAdmin && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-widest border border-blue-200 dark:border-blue-800/50">
                <Shield size={10} />
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-5 space-y-4 flex-1">
          {[
            { label: "UID", value: user.uid, mono: true },
            { label: "Level", value: user.level ? `Level ${user.level}` : "—" },
            {
              label: "Joined",
              value: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—",
            },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                {label}
              </p>
              <p
                className={`text-sm text-slate-700 dark:text-slate-200 break-all ${mono ? "font-mono text-xs" : ""}`}
              >
                {value}
              </p>
            </div>
          ))}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Exam Performance
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700">
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {user.examCount}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Exams taken
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700">
                <p
                  className={`text-2xl font-black ${SCORE_COLOR(user.avgScore)}`}
                >
                  {user.avgScore !== null ? `${user.avgScore}%` : "—"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Average score
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setUsers(d.users);
      })
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.uid.toLowerCase().includes(q);
      const matchesLevel = levelFilter === "all" || u.level === levelFilter;
      return matchesQuery && matchesLevel;
    });

    list = [...list].sort((a, b) => {
      let av: string | number | null = a[sortKey];
      let bv: string | number | null = b[sortKey];

      if (sortKey === "createdAt") {
        av = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bv = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      }
      if (sortKey === "avgScore") {
        av = a.avgScore ?? -1;
        bv = b.avgScore ?? -1;
      }

      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [users, query, levelFilter, sortKey, sortDir]);

  return (
    <AppShell>
      <PageHeader
        title="Users"
        subtitle="All registered students on the platform"
      />

      {!loading && !error && (
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { label: "Total users", value: users.length },
            {
              label: "Admins",
              value: users.filter((u) => u.isAdmin).length,
            },
            ...LEVEL_OPTIONS.filter((l) => l !== "all").map((l) => ({
              label: `Level ${l}`,
              value: users.filter((u) => u.level === l).length,
            })),
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                {s.value}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by username, email or UID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {LEVEL_OPTIONS.map((l) => (
            <option key={l} value={l}>
              {l === "all" ? "All Levels" : `Level ${l}`}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        {loading ? (
          <Loader label="Loading users..." size="lg" />
        ) : error ? (
          <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={22} />}
            title="No users found"
            description={
              query || levelFilter !== "all"
                ? "No users match your search or filter."
                : "No users have registered yet."
            }
          />
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <TH
                      label="User"
                      col="username"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <TH
                      label="UID"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                      className="hidden lg:table-cell"
                    />
                    <TH
                      label="Level"
                      col="level"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <TH
                      label="Joined"
                      col="createdAt"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                      className="hidden md:table-cell"
                    />
                    <TH
                      label="Exams"
                      col="examCount"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <TH
                      label="Avg Score"
                      col="avgScore"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filtered.map((u) => (
                    <tr
                      key={u.uid}
                      onClick={() => setSelected(u)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            {u.isAdmin ? (
                              <Shield
                                size={14}
                                className="text-blue-600 dark:text-blue-400"
                              />
                            ) : (
                              <GraduationCap
                                size={14}
                                className="text-blue-600 dark:text-blue-400"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                {u.username}
                              </p>
                              {u.isAdmin && (
                                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 shrink-0">
                                  Admin
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 hidden lg:table-cell">
                        <CopyUid uid={u.uid} />
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {u.level !== "—" ? `L${u.level}` : "—"}
                        </span>
                      </td>

                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {u.examCount}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-bold ${SCORE_COLOR(u.avgScore)}`}
                        >
                          {u.avgScore !== null ? `${u.avgScore}%` : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {users.length}
                </span>{" "}
                users
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Click a row to view details
              </p>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <UserDrawer user={selected} onClose={() => setSelected(null)} />
      )}
    </AppShell>
  );
}
