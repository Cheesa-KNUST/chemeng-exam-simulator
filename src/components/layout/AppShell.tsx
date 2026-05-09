"use client";

import { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

type Props = {
  children: ReactNode;
};

function usePersistentState(key: string, initialValue: boolean) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    return localStorage.getItem(key) === "true";
  });

  const setPersistentState = (value: boolean | ((v: boolean) => boolean)) => {
    setState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      localStorage.setItem(key, String(next));
      return next;
    });
  };

  return [state, setPersistentState] as const;
}

export default function AppShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = usePersistentState(
    "sidebar-collapsed",
    false,
  );

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="flex bg-slate-100 dark:bg-slate-900 min-h-screen">
      <div className="hidden lg:block h-screen sticky top-0">
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      </div>

      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
