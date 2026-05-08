"use client";

import { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-slate-100 dark:bg-slate-900 min-h-screen">
      <div className="hidden lg:block h-screen sticky top-0">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((p) => !p)}
        />
      </div>

      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
