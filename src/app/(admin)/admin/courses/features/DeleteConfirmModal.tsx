import Button from "@/components/ui/Button";
import { Course } from "../utils/useCourses";

type Props = {
  course: Course;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmModal({
  course,
  deleting,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
          Delete course?
        </h3>
        <p className="text-sm text-slate-500 mb-2">
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {course.title}
          </span>{" "}
          will be permanently deleted.
        </p>

        {course.exams > 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2 mb-4">
            This course has {course.exams} exam{course.exams !== 1 ? "s" : ""}.
            Deleting the course will not automatically delete its exams.
          </p>
        )}

        <div className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-60"
          >
            {deleting ? (
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
  );
}
