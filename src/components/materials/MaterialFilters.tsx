"use client";

import { Search, X } from "lucide-react";

export type FilterState = {
  query: string;
  course: string;
  year: string;
  semester: string;
  fileType: string;
  tag: string;
};

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableTags: string[];
  availableCourses: string[];
};

const SELECT_CLASS =
  "h-10 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function MaterialFilters({
  filters,
  onChange,
  availableTags,
  availableCourses,
}: Props) {
  const set = (key: keyof FilterState, value: string) =>
    onChange({ ...filters, [key]: value });

  const hasActiveFilters =
    filters.course !== "all" ||
    filters.year !== "all" ||
    filters.semester !== "all" ||
    filters.fileType !== "all" ||
    filters.tag !== "all" ||
    filters.query !== "";

  const reset = () =>
    onChange({
      query: "",
      course: "all",
      year: "all",
      semester: "all",
      fileType: "all",
      tag: "all",
    });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={filters.query}
          onChange={(e) => set("query", e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.course}
          onChange={(e) => set("course", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="all">All Courses</option>
          {availableCourses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.year}
          onChange={(e) => set("year", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="all">All Years</option>
          <option value="100">Level 100</option>
          <option value="200">Level 200</option>
          <option value="300">Level 300</option>
          <option value="400">Level 400</option>
        </select>

        <select
          value={filters.semester}
          onChange={(e) => set("semester", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="all">All Semesters</option>
          <option value="First">First Semester</option>
          <option value="Second">Second Semester</option>
        </select>

        <select
          value={filters.fileType}
          onChange={(e) => set("fileType", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="doc">Document</option>
          <option value="ppt">Slides</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>

        {availableTags.length > 0 && (
          <select
            value={filters.tag}
            onChange={(e) => set("tag", e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="all">All Tags</option>
            {availableTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        {hasActiveFilters && (
          <button
            onClick={reset}
            className="h-10 flex items-center gap-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-700 transition-colors"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
