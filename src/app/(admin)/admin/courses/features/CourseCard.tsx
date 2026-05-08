import { Pencil, Trash2 } from "lucide-react";
import { Course } from "../utils/useCourses";

type Props = {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
};

export default function CourseCard({ course, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col">
      <div className="flex-1">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
          {course.title}
        </h3>
        <p className="text-xs font-mono text-slate-400 mt-0.5">{course.slug}</p>
        <p className="text-sm text-justify text-slate-500 dark:text-slate-400 mt-2">
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
            onClick={() => onEdit(course)}
            className="text-slate-400 hover:text-blue-500 transition"
            title="Edit course"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(course)}
            className="text-slate-400 hover:text-red-500 transition"
            title="Delete course"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
