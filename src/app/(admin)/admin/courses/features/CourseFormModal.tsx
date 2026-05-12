import { useState } from "react";
import { X, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Course } from "../utils/useCourses";

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

const emptyForm = (): FormState => ({
  slug: "",
  title: "",
  description: "",
  level: 100,
  semester: 1,
});

type Props = {
  editingCourse: Course | null;
  onClose: () => void;
  onSave: (form: FormState, editingSlug: string | null) => Promise<void>;
};

export default function CourseFormModal({
  editingCourse,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<FormState>(
    editingCourse
      ? {
          slug: editingCourse.slug,
          title: editingCourse.title,
          description: editingCourse.description,
          level: editingCourse.level,
          semester: editingCourse.semester,
        }
      : emptyForm(),
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const editingSlug = editingCourse?.slug ?? null;

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
    if (!form.level || form.level < 100) e.level = "Level is required";
    if (!form.semester || form.semester < 1)
      e.semester = "Semester is required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(form, editingSlug);
      onClose();
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
            {editingSlug === null ? "New Course" : "Edit Course"}
          </h3>
          <button
            onClick={onClose}
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
              <p className="text-xs text-red-400 mt-1">{formErrors.title}</p>
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
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
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
                step={100}
                min={100}
                max={400}
                onChange={(e) =>
                  setForm((p) => ({ ...p, level: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <label className="text-sm">Semester</label>
              <Input
                type="number"
                step={1}
                min={1}
                max={2}
                value={form.semester}
                onChange={(e) =>
                  setForm((p) => ({ ...p, semester: Number(e.target.value) }))
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
            onClick={onClose}
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
  );
}
