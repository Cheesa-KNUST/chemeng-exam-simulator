"use client";

import { useState, useEffect, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import MaterialCard from "@/components/materials/MaterialCard";
import MaterialFilters, {
  FilterState,
} from "@/components/materials/MaterialFilters";
import StudentSubmitModal from "@/components/materials/StudentSubmitModal";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import {
  Material,
  listenToApprovedMaterials,
  incrementDownload,
} from "@/lib/materialService";
import { BookOpen, Upload } from "lucide-react";

const INITIAL_FILTERS: FilterState = {
  query: "",
  course: "all",
  year: "all",
  semester: "all",
  fileType: "all",
  tag: "all",
};

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    const unsub = listenToApprovedMaterials((data) => {
      setMaterials(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const availableCourses = useMemo(
    () => [...new Set(materials.map((m) => m.course))].sort(),
    [materials],
  );

  const availableTags = useMemo(
    () => [...new Set(materials.flatMap((m) => m.tags))].sort(),
    [materials],
  );

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const q = filters.query.toLowerCase();
      if (
        q &&
        !m.title.toLowerCase().includes(q) &&
        !m.description.toLowerCase().includes(q) &&
        !m.course.toLowerCase().includes(q)
      )
        return false;

      if (filters.course !== "all" && m.course !== filters.course) return false;
      if (filters.year !== "all" && m.year !== filters.year) return false;
      if (filters.semester !== "all" && m.semester !== filters.semester)
        return false;
      if (filters.fileType !== "all" && m.fileType !== filters.fileType)
        return false;
      if (filters.tag !== "all" && !m.tags.includes(filters.tag)) return false;

      return true;
    });
  }, [materials, filters]);

  const handleDownload = async (m: Material) => {
    if (m.fileType === "video") {
      window.open(m.fileUrl, "_blank", "noopener,noreferrer");
    } else {
      const a = document.createElement("a");
      a.href = m.fileUrl;
      a.download = m.fileName;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    await incrementDownload(m.id);
  };

  return (
    <AppShell>
      <PageHeader
        title="Reference Materials"
        subtitle="Browse and download resources shared by your department"
        action={
          <button
            onClick={() => setSubmitOpen(true)}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Upload size={15} />
            Share a Resource
          </button>
        }
      />

      {!loading && materials.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { label: "Total resources", value: materials.length },
            {
              label: "Courses covered",
              value: new Set(materials.map((m) => m.course)).size,
            },
            {
              label: "Total downloads",
              value: materials.reduce((acc, m) => acc + m.downloadCount, 0),
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                {s.value}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <MaterialFilters
          filters={filters}
          onChange={setFilters}
          availableCourses={availableCourses}
          availableTags={availableTags}
        />
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader label="Loading materials..." size="lg" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={22} />}
            title={
              filters.query ||
              filters.course !== "all" ||
              filters.year !== "all" ||
              filters.semester !== "all" ||
              filters.fileType !== "all" ||
              filters.tag !== "all"
                ? "No materials match your filters"
                : "No materials yet"
            }
            description={
              filters.query ||
              filters.course !== "all" ||
              filters.year !== "all" ||
              filters.semester !== "all" ||
              filters.fileType !== "all" ||
              filters.tag !== "all"
                ? "Try adjusting your filters or search term."
                : "Check back later — resources will appear here once uploaded."
            }
            action={
              <button
                onClick={() => setSubmitOpen(true)}
                className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                <Upload size={15} />
                Be the first to share
              </button>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <MaterialCard
                key={m.id}
                material={m}
                isAdmin={false}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>

      {submitOpen && (
        <StudentSubmitModal
          onClose={() => setSubmitOpen(false)}
          onSuccess={() =>
            showToast("Submitted! Your resource is under review.")
          }
        />
      )}

      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 dark:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 dark:border-slate-600">
          {toastMsg}
        </div>
      )}
    </AppShell>
  );
}
