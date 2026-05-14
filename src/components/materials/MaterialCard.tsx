"use client";

import {
  FileText,
  FileImage,
  Presentation,
  FileType2,
  Video,
  Download,
  Clock,
  Tag,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Material, formatFileSize } from "@/lib/materialService";

const FILE_TYPE_CONFIG = {
  pdf: {
    icon: FileText,
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-100 dark:border-red-800/40",
    label: "PDF",
  },
  doc: {
    icon: FileType2,
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-100 dark:border-blue-800/40",
    label: "Document",
  },
  ppt: {
    icon: Presentation,
    color: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-100 dark:border-orange-800/40",
    label: "Slides",
  },
  image: {
    icon: FileImage,
    color: "text-purple-500 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-100 dark:border-purple-800/40",
    label: "Image",
  },
  video: {
    icon: Video,
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-100 dark:border-red-800/40",
    label: "Video",
  },
};

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    class:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
  },
  pending: {
    label: "Pending",
    class:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
  },
  rejected: {
    label: "Rejected",
    class:
      "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50",
  },
};

type Props = {
  material: Material;
  isAdmin?: boolean;
  onApprove?: (m: Material) => void;
  onReject?: (m: Material) => void;
  onDelete?: (m: Material) => void;
  onDownload?: (m: Material) => void;
};

export default function MaterialCard({
  material,
  isAdmin = false,
  onApprove,
  onReject,
  onDelete,
  onDownload,
}: Props) {
  const typeConfig = FILE_TYPE_CONFIG[material.fileType];
  const TypeIcon = typeConfig.icon;
  const statusConfig = STATUS_CONFIG[material.status];

  const formattedDate = material.uploadedAt
    ? new Date(material.uploadedAt.toDate()).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b ${typeConfig.bg} ${typeConfig.border}`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 border ${typeConfig.border} shrink-0`}
        >
          <TypeIcon size={18} className={typeConfig.color} />
        </div>

        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {typeConfig.label}
          </p>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
            {material.title}
          </p>
        </div>

        {isAdmin && (
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border shrink-0 ${statusConfig.class}`}
          >
            {statusConfig.label}
          </span>
        )}
      </div>

      <div className="px-4 py-3 flex-1 space-y-3">
        {material.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {material.description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Course:
            </span>{" "}
            {material.course}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Year:
            </span>{" "}
            Level {material.year}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Semester:
            </span>{" "}
            {material.semester}
          </span>
          {material.fileType !== "video" && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Size:
              </span>{" "}
              {formatFileSize(material.size)}
            </span>
          )}
        </div>

        {material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {material.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium"
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
            {material.tags.length > 4 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 self-center">
                +{material.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Download size={11} />
            {material.downloadCount}
          </span>
          {isAdmin && (
            <span className="text-[11px] truncate max-w-35">
              Uploaded by {material.uploaderName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isAdmin ? (
            <>
              {material.status === "pending" && (
                <>
                  <button
                    onClick={() => onApprove?.(material)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 transition-colors"
                  >
                    <CheckCircle2 size={12} />
                    Approve
                  </button>
                  <button
                    onClick={() => onReject?.(material)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800/50 transition-colors"
                  >
                    <XCircle size={12} />
                    Reject
                  </button>
                </>
              )}
              {material.status === "approved" && (
                <button
                  onClick={() => onReject?.(material)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors"
                >
                  <XCircle size={12} />
                  Unpublish
                </button>
              )}
              {material.status === "rejected" && (
                <button
                  onClick={() => onApprove?.(material)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors"
                >
                  <CheckCircle2 size={12} />
                  Re-approve
                </button>
              )}
              <button
                onClick={() => onDelete?.(material)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-800/50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={() => onDownload?.(material)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {material.fileType === "video" ? (
                <>
                  <ExternalLink size={12} /> Watch
                </>
              ) : (
                <>
                  <Download size={12} /> Download
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
