"use client";

import { useState, useRef } from "react";
import { X, Upload, Link2, Loader2, Plus, Tag } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  addMaterial,
  fileTypeFromMime,
  MaterialInput,
} from "@/lib/materialService";
import { useAuth } from "@/context/AuthContext";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

const INITIAL_FORM = {
  title: "",
  description: "",
  course: "",
  year: "100",
  semester: "First",
  tags: [] as string[],
  videoUrl: "",
};

export default function AdminUploadModal({ onClose, onSuccess }: Props) {
  const { uid, profile } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof INITIAL_FORM, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm((p) => ({ ...p, tags: [...p.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));

  const handleSubmit = async () => {
    setError("");

    if (!form.title.trim()) return setError("Title is required.");
    if (!form.course.trim()) return setError("Course is required.");
    if (isVideo && !form.videoUrl.trim())
      return setError("Video URL is required.");
    if (!isVideo && !file) return setError("Please select a file to upload.");

    try {
      setProgress(0);
      setUploading(true);

      let input: MaterialInput;

      if (isVideo) {
        input = {
          title: form.title.trim(),
          description: form.description.trim(),
          course: form.course.trim().toUpperCase(),
          year: form.year,
          semester: form.semester,
          tags: form.tags,
          fileType: "video",
          fileUrl: form.videoUrl.trim(),
          fileName: form.videoUrl.trim(),
          publicId: "",
          status: "approved",
          uploadedBy: uid ?? "",
          uploaderName: profile?.username ?? "Admin",
          size: 0,
          resourceType: "video",
        };
      } else {
        const { url, publicId, size, fileName, resourceType } =
          await uploadToCloudinary(file!, setProgress);

        input = {
          title: form.title.trim(),
          description: form.description.trim(),
          course: form.course.trim().toUpperCase(),
          year: form.year,
          semester: form.semester,
          tags: form.tags,
          fileType: fileTypeFromMime(file!),
          fileUrl: url,
          fileName,
          publicId,
          status: "approved",
          uploadedBy: uid ?? "",
          uploaderName: profile?.username ?? "Admin",
          size,
          resourceType,
        };
      }

      await addMaterial(input);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const INPUT_CLASS =
    "w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Upload Material
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Files are published immediately
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {[
              { label: "File Upload", value: false, icon: Upload },
              { label: "Video Link", value: true, icon: Link2 },
            ].map(({ label, value, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setIsVideo(value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                  isVideo === value
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {isVideo ? (
            <input
              type="url"
              placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)"
              value={form.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              className={INPUT_CLASS}
            />
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <Upload size={20} className="text-slate-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                {file ? (
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {file.name}
                  </span>
                ) : (
                  <>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                    <br />
                    <span className="text-xs">
                      PDF, Word, PowerPoint, Images
                    </span>
                  </>
                )}
              </p>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={INPUT_CLASS}
          />

          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <input
            type="text"
            placeholder="Course code (e.g. CHE 301) *"
            value={form.course}
            onChange={(e) => set("course", e.target.value)}
            className={INPUT_CLASS}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="100">Level 100</option>
              <option value="200">Level 200</option>
              <option value="300">Level 300</option>
              <option value="400">Level 400</option>
            </select>

            <select
              value={form.semester}
              onChange={(e) => set("semester", e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="First">First Semester</option>
              <option value="Second">Second Semester</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag (e.g. thermodynamics)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                className={`${INPUT_CLASS} flex-1`}
              />
              <button
                onClick={addTag}
                className="px-3 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800/50"
                  >
                    <Tag size={9} />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 h-10 rounded-xl border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={14} />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
