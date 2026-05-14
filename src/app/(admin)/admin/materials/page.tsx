"use client";

import { useState, useEffect, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import MaterialCard from "@/components/materials/MaterialCard";
import MaterialFilters, {
  FilterState,
} from "@/components/materials/MaterialFilters";
import AdminUploadModal from "@/components/materials/AdminUploadModal";
import DeleteConfirmModal from "@/components/materials/DeleteConfirmModal";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import {
  Material,
  listenToAllMaterials,
  setMaterialStatus,
  deleteMaterial,
} from "@/lib/materialService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import {
  PlusCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  Library,
} from "lucide-react";

const INITIAL_FILTERS: FilterState = {
  query: "",
  course: "all",
  year: "all",
  semester: "all",
  fileType: "all",
  tag: "all",
};

type StatusTab = "all" | "pending" | "approved" | "rejected";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Material | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    const unsub = listenToAllMaterials((data) => {
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

  const counts = useMemo(
    () => ({
      all: materials.length,
      pending: materials.filter((m) => m.status === "pending").length,
      approved: materials.filter((m) => m.status === "approved").length,
      rejected: materials.filter((m) => m.status === "rejected").length,
    }),
    [materials],
  );

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (statusTab !== "all" && m.status !== statusTab) return false;

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
  }, [materials, filters, statusTab]);

  const handleApprove = async (m: Material) => {
    await setMaterialStatus(m.id, "approved");
    showToast(`"${m.title}" approved`);
  };

  const handleReject = async (m: Material) => {
    await setMaterialStatus(m.id, "rejected");
    showToast(`"${m.title}" unpublished`);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      if (confirmDelete.publicId) {
        await deleteFromCloudinary(
          confirmDelete.publicId,
          confirmDelete.resourceType,
        );
      }
      await deleteMaterial(confirmDelete.id);
      showToast(`"${confirmDelete.title}" deleted`);
    } catch {
      showToast("Delete failed — please try again");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const TABS: { key: StatusTab; label: string; icon: React.ReactNode }[] = [
    {
      key: "all",
      label: "All",
      icon: <Library size={13} />,
    },
    {
      key: "pending",
      label: "Pending",
      icon: <Clock size={13} />,
    },
    {
      key: "approved",
      label: "Approved",
      icon: <CheckCircle2 size={13} />,
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: <XCircle size={13} />,
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Reference Materials"
        subtitle="Manage, upload and review all reference materials"
        action={
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            <PlusCircle size={15} />
            Upload Material
          </button>
        }
      />

      <div className="flex gap-1 mt-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setStatusTab(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusTab === key
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {icon}
            {label}
            <span
              className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                statusTab === key
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

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
              statusTab === "pending"
                ? "No pending submissions"
                : "No materials found"
            }
            description={
              statusTab === "pending"
                ? "Student submissions will appear here for review."
                : "Upload your first reference material to get started."
            }
            action={
              statusTab === "all" ? (
                <button
                  onClick={() => setUploadOpen(true)}
                  className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
                >
                  <PlusCircle size={15} />
                  Upload Material
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <MaterialCard
                key={m.id}
                material={m}
                isAdmin
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={setConfirmDelete}
              />
            ))}
          </div>
        )}
      </div>

      {uploadOpen && (
        <AdminUploadModal
          onClose={() => setUploadOpen(false)}
          onSuccess={() => showToast("Material uploaded successfully")}
        />
      )}

      {confirmDelete && (
        <DeleteConfirmModal
          material={confirmDelete}
          deleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 dark:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 dark:border-slate-600 animate-fade-in">
          {toastMsg}
        </div>
      )}
    </AppShell>
  );
}
