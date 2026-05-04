"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import { BookOpen, PlusCircle, Pencil, Trash2, X, Check } from "lucide-react";

type Course = {
  slug: string;
  title: string;
  description: string;
  exams: number;

  level: number;
  semester: number;
};

type FormState = {
  slug: string;
  title: string;
  description: string;
  level: number;
  semester: number;
};

type FormErrors = {
  slug?: string;
  title?: string;
  description?: string;
  level?: string;
  semester?: string;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function useToast() {
  const toast = (msg: string, success = true) => {
    const el = document.createElement("div");
    el.innerText = msg;
    el.className = `fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium text-white ${
      success ? "bg-emerald-600" : "bg-red-600"
    }`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };
  return { toast };
}

const emptyForm = (): FormState => ({
  slug: "",
  title: "",
  description: "",
  level: 100,
  semester: 1,
});

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<Course | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const res = await fetch(`/api/courses`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      setCourses(data);
    } catch {
      setCourses([]);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const res = await fetch(`/api/courses`);
        if (!res.ok) throw new Error();

        const data = await res.json();

        if (isMounted) {
          setCourses(data);
        }
      } catch {
        if (isMounted) {
          setCourses([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      ...(editingSlug === null ? { slug: slugify(title) } : {}),
    }));
  };

  const validateForm = () => {
    const e: FormErrors = {};

    if (!form.title.trim()) e.title = "Title is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.description.trim()) e.description = "Description is required";

    if (!form.level || form.level < 100) {
      e.level = "Level is required";
    }

    if (!form.semester || form.semester < 1) {
      e.semester = "Semester is required";
    }

    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => {
    setForm(emptyForm());
    setFormErrors({});
    setSaveError(null);
    setEditingSlug(null);
    setModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setForm({
      slug: course.slug,
      title: course.title,
      description: course.description,
      level: course.level,
      semester: course.semester,
    });
    setFormErrors({});
    setSaveError(null);
    setEditingSlug(course.slug);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    setSaveError(null);

    try {
      if (editingSlug === null) {
        const res = await fetch(`/api/courses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, exams: 0 }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to create course");
        }
      } else {
        const res = await fetch(`/api/courses/${editingSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            level: form.level,
            semester: form.semester,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to update course");
        }
      }
      setModalOpen(false);
      await fetchCourses();
      toast("Course saved successfully", true);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Unexpected error");
      toast("Failed to save course", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course: Course) => {
    setDeletingSlug(course.slug);
    try {
      const res = await fetch(`/api/courses/${course.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setCourses((prev) => prev.filter((c) => c.slug !== course.slug));
      toast("Course deleted successfully", true);
    } catch {
      toast("Failed to delete course", true);
    } finally {
      setDeletingSlug(null);
      setConfirmDelete(null);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.slug.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader
        title="Courses"
        subtitle="Manage courses available to students"
        action={
          <Button
            variant="primary"
            className="flex items-center"
            onClick={openCreate}
          >
            <PlusCircle size={15} className="mr-1.5" /> New Course
          </Button>
        }
      />

      <Input
        placeholder="Search courses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mt-5">
        {loading ? (
          <Loader label="Loading courses..." size="lg" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={22} />}
            title="No courses found"
            description={
              query
                ? "No courses match your search."
                : "Create your first course to get started."
            }
            action={
              <Button variant="primary" onClick={openCreate}>
                Create Course
              </Button>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((course) => (
              <div
                key={course.slug}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    {course.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    {course.slug}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {course.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      Level: {course.level ?? "—"}
                    </span>

                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      Semester: {course.semester ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {course.exams} exam{course.exams !== 1 ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(course)}
                      className="text-slate-400 hover:text-blue-500 transition"
                      title="Edit course"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(course)}
                      className="text-slate-400 hover:text-red-500 transition"
                      title="Delete course"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {editingSlug === null ? "New Course" : "Edit Course"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Thermodynamics"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                {formErrors.title && (
                  <p className="text-xs text-red-400 mt-1">
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Slug{" "}
                  <span className="text-xs font-normal text-slate-400">
                    {editingSlug === null
                      ? "(auto-generated)"
                      : "(cannot be changed)"}
                  </span>
                </label>
                <Input
                  placeholder="e.g. thermodynamics"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, slug: e.target.value }))
                  }
                  disabled={editingSlug !== null}
                />
                {formErrors.slug && (
                  <p className="text-xs text-red-400 mt-1">{formErrors.slug}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  placeholder="Brief description of what the course covers..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition resize-none placeholder:text-slate-400"
                />
                {formErrors.description && (
                  <p className="text-xs text-red-400 mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Level</label>
                  <Input
                    type="number"
                    value={form.level}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, level: Number(e.target.value) }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm">Semester</label>
                  <Input
                    type="number"
                    value={form.semester}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        semester: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {saveError && (
              <p className="text-sm text-red-500 mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
                {saveError}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <Check size={15} />
                    {editingSlug === null ? "Create Course" : "Save Changes"}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
              Delete course?
            </h3>
            <p className="text-sm text-slate-500 mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {confirmDelete.title}
              </span>{" "}
              will be permanently deleted.
            </p>
            {confirmDelete.exams > 0 && (
              <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2 mb-4">
                This course has {confirmDelete.exams} exam
                {confirmDelete.exams !== 1 ? "s" : ""}. Deleting the course will
                not automatically delete its exams.
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirmDelete(null)}
                disabled={!!deletingSlug}
              >
                Cancel
              </Button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={!!deletingSlug}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-60"
              >
                {deletingSlug === confirmDelete.slug ? (
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
