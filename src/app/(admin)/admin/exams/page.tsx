"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import {
  Clock,
  Flame,
  HelpCircle,
  Layers,
  Pencil,
  Trash2,
  PlusCircle,
  ClipboardList,
} from "lucide-react";

type Exam = {
  id: string;
  courseSlug: string;
  title: string;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  type: string;
  questions: unknown[];
};

const DIFFICULTY_COLORS = {
  Easy: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  Medium:
    "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  Hard: "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Exam | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch(`/api/exams`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        if (mounted) setExams(data);
      } catch {
        if (mounted) setExams([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (exam: Exam) => {
    setDeletingId(exam.id);
    try {
      await fetch(`/api/exams/${exam.id}`, { method: "DELETE" });
      setExams((prev) => prev.filter((e) => e.id !== exam.id));
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const uniqueCourses = Array.from(new Set(exams.map((e) => e.courseSlug)));

  const filtered = exams.filter((e) => {
    const matchQuery = e.title.toLowerCase().includes(query.toLowerCase());
    const matchCourse = courseFilter ? e.courseSlug === courseFilter : true;
    return matchQuery && matchCourse;
  });

  return (
    <AppShell>
      <PageHeader
        title="Exams"
        subtitle="Manage all exams across courses"
        action={
          <Link href="/admin/exams/new">
            <Button variant="primary" className="flex items-center">
              <PlusCircle size={16} className="mr-2" />
              New Exam
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search exams..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition"
        >
          <option value="">All courses</option>
          {uniqueCourses.map((slug) => (
            <option key={slug} value={slug}>
              {slug}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading exams..." fullPage size="lg" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={22} />}
          title="No exams found"
          description={
            query || courseFilter
              ? "Try adjusting your filters."
              : "Create your first exam to get started."
          }
          action={
            <Link href="/admin/exams/new">
              <Button variant="primary">Create Exam</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono truncate">
                    {exam.id}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-lg border ${DIFFICULTY_COLORS[exam.difficulty] ?? DIFFICULTY_COLORS.Easy}`}
                >
                  {exam.difficulty}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <Layers size={13} />
                  <span className="truncate">{exam.courseSlug}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {exam.duration} mins
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={13} />
                  {exam.questions.length} question
                  {exam.questions.length > 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame size={13} />
                  {exam.type}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <Link href={`/admin/exams/${exam.id}/edit`} className="flex-1">
                  <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center"
                  >
                    <Pencil size={14} className="mr-2" />
                    Edit
                  </Button>
                </Link>
                <button
                  onClick={() => setConfirmDelete(exam)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-700 transition"
                  title="Delete exam"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
              Delete exam?
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {confirmDelete.title}
              </span>{" "}
              will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirmDelete(null)}
                disabled={!!deletingId}
              >
                Cancel
              </Button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={!!deletingId}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-60"
              >
                {deletingId === confirmDelete.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
