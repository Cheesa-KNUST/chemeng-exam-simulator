"use client";

import {
  HelpCircle,
  BookOpen,
  Flag,
  Clock,
  MousePointerClick,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";

export default function HelpPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <HelpCircle className="text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Help & Guide
          </h1>
        </div>

        <p className="text-slate-600 dark:text-slate-300">
          This guide explains how to use the ChemEng Exam Simulator effectively.
        </p>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
            <BookOpen size={18} />
            Taking an Exam
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Each exam contains multiple-choice questions. Select an answer and
            it is saved automatically.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
            <MousePointerClick size={18} />
            Navigation
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            You can move between questions using Next/Previous buttons or by
            clicking question numbers in the sidebar.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
            <Flag size={18} />
            Flagging Questions
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Flag questions you want to revisit later. Flagged questions are
            highlighted in your exam sidebar.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
            <Clock size={18} />
            Time Management
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Exams are timed. If the timer reaches zero, your exam will be
            submitted automatically.
          </p>
        </section>

        <div className="text-xs text-slate-400 dark:text-slate-500">
          If you need additional help, contact your department administrator.
        </div>
      </div>
    </AppShell>
  );
}
