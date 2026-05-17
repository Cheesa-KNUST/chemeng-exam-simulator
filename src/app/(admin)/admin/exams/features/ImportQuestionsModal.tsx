"use client";

import { useRef, useState } from "react";
import {
  FileText,
  FileJson,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { ExamQuestion, KIND_LABELS } from "@/app/(admin)/admin/exams/new/types";

type Props = {
  onImport: (questions: ExamQuestion[]) => void;
  onClose: () => void;
};

type FileMode = "pdf" | "json";

type ExtractionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; questions: ExamQuestion[]; skipped: number }
  | { status: "error"; message: string };

const KIND_COLORS: Record<ExamQuestion["kind"], string> = {
  mcq: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  true_false:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  fill_in:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  pictorial_mcq:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
};

function getAnswerPreview(q: ExamQuestion): string {
  if (q.kind === "mcq" || q.kind === "true_false" || q.kind === "pictorial_mcq")
    return `Answer: ${q.answer}`;
  if (q.kind === "fill_in") {
    if (q.answerType === "range")
      return `Answer: ${q.answerMin} – ${q.answerMax}`;
    if (q.answerType === "number")
      return q.tolerance
        ? `Answer: ${q.answer} ± ${q.tolerance}`
        : `Answer: ${q.answer}`;
    return `Answer: ${q.answer}`;
  }
  return "";
}

export default function ImportQuestionsModal({ onImport, onClose }: Props) {
  const [mode, setMode] = useState<FileMode>("pdf");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extraction, setExtraction] = useState<ExtractionState>({
    status: "idle",
  });
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptAttr = mode === "pdf" ? ".pdf" : ".json";

  const handleFile = (file: File) => {
    const isPDF = file.type === "application/pdf";
    const isJSON =
      file.type === "application/json" || file.name.endsWith(".json");
    if ((mode === "pdf" && !isPDF) || (mode === "json" && !isJSON)) {
      setExtraction({
        status: "error",
        message: `Please upload a ${mode.toUpperCase()} file.`,
      });
      return;
    }
    setSelectedFile(file);
    setExtraction({ status: "idle" });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleExtract = async () => {
    if (!selectedFile) return;
    setExtraction({ status: "loading" });

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/exams/extract", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setExtraction({
          status: "error",
          message: data.error ?? "Extraction failed.",
        });
        return;
      }
      const questions: ExamQuestion[] = data.questions;
      setExtraction({
        status: "success",
        questions,
        skipped: data.skipped ?? 0,
      });
      setSelected(new Set(questions.map((_, i) => i)));
    } catch {
      setExtraction({
        status: "error",
        message: "Network error. Please try again.",
      });
    }
  };

  const toggleSelect = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (extraction.status !== "success") return;
    if (selected.size === extraction.questions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(extraction.questions.map((_, i) => i)));
    }
  };

  const handleImport = () => {
    if (extraction.status !== "success") return;
    const toImport = extraction.questions.filter((_, i) => selected.has(i));
    if (toImport.length === 0) return;
    onImport(toImport);
  };

  const resetFile = () => {
    setSelectedFile(null);
    setExtraction({ status: "idle" });
    setSelected(new Set());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Import Questions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload a PDF exam paper or a JSON question file
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 no-scrollbar">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
            {(["pdf", "json"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  resetFile();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  mode === m
                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                }`}
              >
                {m === "pdf" ? <FileText size={14} /> : <FileJson size={14} />}
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {!selectedFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-12 cursor-pointer transition select-none ${
                dragOver
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/10"
                  : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Upload size={22} className="text-slate-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Drop your {mode.toUpperCase()} here, or{" "}
                  <span className="text-blue-500">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === "pdf"
                    ? "Scanned or digital exam papers"
                    : "Must match ExamQuestion[] schema"}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptAttr}
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                {mode === "pdf" ? (
                  <FileText size={16} className="text-blue-500" />
                ) : (
                  <FileJson size={16} className="text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={resetFile}
                className="text-slate-400 hover:text-red-400 transition shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {extraction.status === "error" && (
            <div className="flex items-start gap-2.5 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {extraction.message}
            </div>
          )}

          {extraction.status === "success" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {extraction.questions.length} question
                    {extraction.questions.length !== 1 ? "s" : ""} extracted
                  </p>
                  {extraction.skipped > 0 && (
                    <span className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md">
                      {extraction.skipped} skipped (unrecognised)
                    </span>
                  )}
                </div>
                <button
                  onClick={toggleAll}
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium transition"
                >
                  {selected.size === extraction.questions.length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                {extraction.questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => toggleSelect(i)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition ${
                      selected.has(i)
                        ? "border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-50"
                    }`}
                  >
                    <div
                      className={`shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition ${
                        selected.has(i)
                          ? "bg-blue-500 border-blue-500"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {selected.has(i) && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4l3 3 5-6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-400 font-mono">
                          Q{i + 1}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${KIND_COLORS[q.kind]}`}
                        >
                          {KIND_LABELS[q.kind]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 truncate">
                        {q.question}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {getAnswerPreview(q)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            {extraction.status !== "success" ? (
              <Button
                variant="primary"
                onClick={handleExtract}
                disabled={!selectedFile || extraction.status === "loading"}
              >
                {extraction.status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {mode === "pdf" ? "Extracting…" : "Parsing…"}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === "pdf" ? "Extract Questions" : "Parse JSON"}
                    <ChevronRight size={14} />
                  </span>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleImport}
                disabled={selected.size === 0}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle size={14} />
                  Import {selected.size} Question
                  {selected.size !== 1 ? "s" : ""}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
