"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import { BookOpen, PlusCircle } from "lucide-react";

import CourseCard from "./features/CourseCard";
import CourseFormModal from "./features/CourseFormModal";
import DeleteConfirmModal from "./features/DeleteConfirmModal";
import { useCourses, Course } from "./utils/useCourses";
import { useToast } from "./utils/useToast";

export default function AdminCoursesPage() {
  const { courses, loading, createCourse, updateCourse, deleteCourse } =
    useCourses();
  const { toast } = useToast();

  const [query, setQuery] = useState("");

  const [levelFilter, setLevelFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");

  const [modalCourse, setModalCourse] = useState<Course | null | undefined>(
    null,
  );
  const [confirmDelete, setConfirmDelete] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isModalOpen = modalCourse !== null;

  const handleSave = async (
    form: {
      slug: string;
      title: string;
      description: string;
      level: number;
      semester: number;
    },
    editingSlug: string | null,
  ) => {
    if (editingSlug === null) {
      await createCourse(form);
    } else {
      await updateCourse(editingSlug, {
        title: form.title,
        description: form.description,
        level: form.level,
        semester: form.semester,
      });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteCourse(confirmDelete);
    } catch {
      toast("Failed to delete course", false);
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const filtered = courses.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.slug.toLowerCase().includes(query.toLowerCase());

    const matchesLevel =
      levelFilter === "all" || c.level.toString() === levelFilter;

    const matchesSemester =
      semesterFilter === "all" || c.semester.toString() === semesterFilter;

    return matchesQuery && matchesLevel && matchesSemester;
  });

  return (
    <AppShell>
      <PageHeader
        title="Courses"
        subtitle="Manage courses available to students"
        action={
          <Button
            variant="primary"
            className="flex items-center"
            onClick={() => setModalCourse(undefined)}
          >
            <PlusCircle size={15} className="mr-1.5" /> New Course
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row gap-3 mt-4">
        <div className="flex-1">
          <Input
            placeholder="Search courses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="h-12 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-sm"
        >
          <option value="all">All Levels</option>
          <option value="100">Level 100</option>
          <option value="200">Level 200</option>
          <option value="300">Level 300</option>
          <option value="400">Level 400</option>
        </select>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="h-12 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-sm"
        >
          <option value="all">All Semesters</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>
      </div>

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
              <Button
                variant="primary"
                onClick={() => setModalCourse(undefined)}
              >
                Create Course
              </Button>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                onEdit={(c) => setModalCourse(c)}
                onDelete={(c) => setConfirmDelete(c)}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CourseFormModal
          editingCourse={modalCourse ?? null}
          onClose={() => setModalCourse(null)}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <DeleteConfirmModal
          course={confirmDelete}
          deleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </AppShell>
  );
}
