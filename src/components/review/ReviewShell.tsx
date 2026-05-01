"use client";

import { ReactNode } from "react";

type Props = {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
};

export default function ReviewShell({ sidebar, header, children }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="sticky top-0 z-20 shrink-0">{header}</div>
      <div className="flex flex-1 overflow-hidden lg:flex-row flex-col">
        <aside
          className="
            lg:w-72 xl:w-80 shrink-0
            lg:sticky lg:top-(--review-header-h,73px)
            lg:h-[calc(100vh-var(--review-header-h,73px))]
            lg:overflow-y-auto
            lg:border-r border-b lg:border-b-0
            border-slate-200 dark:border-slate-700
            bg-white dark:bg-slate-950
            px-5 py-6
            flex flex-col gap-5
            order-2 lg:order-1
          "
        >
          {sidebar}
        </aside>

        <main
          className="
            flex-1
            lg:h-[calc(100vh-var(--review-header-h,73px))]
            lg:overflow-y-auto
            bg-slate-100 dark:bg-slate-900
            px-4 sm:px-6 lg:px-8
            py-6
            order-1 lg:order-2
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
