"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export default function ExamShell({ children, sidebar }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      <div className="hidden lg:block shrink-0">{sidebar}</div>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-50 shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition z-10"
            >
              <X size={18} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 p-4 md:p-6 overflow-y-auto">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
          >
            <Menu size={16} />
            Question Navigator
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
