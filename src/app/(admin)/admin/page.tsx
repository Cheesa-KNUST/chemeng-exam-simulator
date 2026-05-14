"use client";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { PlusCircle, ClipboardList, LibraryBig } from "lucide-react";

export default function AdminHomePage() {
  return (
    <AppShell>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage exams, users, and system performance"
        action={
          <Link href="/admin/exams/new">
            <Button variant="primary" className="flex items-center">
              <PlusCircle size={16} className="mr-2" />
              New Exam
            </Button>
          </Link>
        }
      />

      <SectionTitle
        title="Quick Actions"
        description="Create and manage assessments"
      />

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/admin/courses">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition">
            <PlusCircle className="mb-2" />
            <p className="font-semibold">Manage Courses</p>
            <p className="text-sm text-slate-500">Add a new course</p>
          </div>
        </Link>

        <Link href="/admin/exams">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition">
            <ClipboardList className="mb-2" />
            <p className="font-semibold">Manage Exams</p>
            <p className="text-sm text-slate-500">Edit or delete exams</p>
          </div>
        </Link>

        <Link href="/admin/materials">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition">
            <LibraryBig className="mb-2" />
            <p className="font-semibold">Reference Materials</p>
            <p className="text-sm text-slate-500">
              Manage uploads and approvals
            </p>
          </div>
        </Link>
      </div>
    </AppShell>
  );
}
