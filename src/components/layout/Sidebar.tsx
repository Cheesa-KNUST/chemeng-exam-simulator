"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  topNavItems,
  bottomNavItems,
  adminNavItems,
  bottomNav,
} from "./navItems";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { logoutUser } from "@/context/authService";
import { useAuth } from "@/context/AuthContext";

type SidebarProps = {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export default function Sidebar({
  onClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { profile, isAdmin, setLoggingOut } = useAuth();

  const isStudentActive = (href: string) => {
    if (href === "/student") return pathname === "/student";
    if (href === "/student/rooms") return pathname === "/student/rooms";
    return pathname === href;
  };

  const isAdminActive = (href: string) => {
    if (href === "/admin/exams") return pathname === "/admin/exams";
    if (href === "/admin/exams/new") return pathname === "/admin/exams/new";
    if (href === "/admin") return pathname === "/admin";
    return pathname === href;
  };

  const isActive = (href: string) =>
    isAdmin ? isAdminActive(href) : isStudentActive(href);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
      setLoggingOut(false);
    }
  };

  const fullName = profile?.username || "Student";
  const nameParts = fullName.trim().split(" ").filter(Boolean);
  const displayName =
    nameParts.length >= 2
      ? `${nameParts[0]} ${nameParts[1][0].toUpperCase()}.`
      : fullName;
  const avatarLetter = fullName.charAt(0).toUpperCase();

  const formatProgram = (program?: string) => {
    if (!program) return "Student";
    const words = program.trim().split(" ").filter(Boolean);
    return words.length >= 2
      ? words[0].slice(0, 4) + words[1].slice(0, 3)
      : words[0].slice(0, 7);
  };

  const shortProgram = formatProgram(profile?.program);

  const navLinkClass = (href: string) =>
    `w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm transition-all ${
      collapsed ? "justify-center" : ""
    } ${
      isActive(href)
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
    }`;

  const navItems = isAdmin ? adminNavItems : topNavItems;
  const botNav = isAdmin ? bottomNav : bottomNavItems;

  return (
    <aside
      className={`${
        collapsed ? "w-18" : "w-64"
      } min-h-screen p-3 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-[width] duration-300 ease-in-out overflow-hidden`}
    >
      <div className="mb-8 flex items-center justify-between min-w-0">
        {!collapsed && (
          <div className="truncate">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              CHEM<span className="text-blue-500 dark:text-blue-400">ENG</span>
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 uppercase tracking-widest">
              Assessment System
            </p>
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`text-slate-400 hover:text-slate-700 dark:hover:text-white transition shrink-0 ${
              collapsed ? "mx-auto" : "ml-auto"
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>
        )}
      </div>

      <nav className="space-y-1 flex-1">
        {!collapsed && (
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest px-3 mb-3">
            Menu
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={navLinkClass(item.href)}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} strokeWidth={1.8} className="shrink-0" />
              {!collapsed && (
                <>
                  {item.label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        {!collapsed && (
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest px-3 mb-3">
            More
          </p>
        )}

        <div className="space-y-1">
          {botNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={navLinkClass(item.href)}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div
          className={`flex items-center px-2 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate max-w-30">
                  {displayName}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {shortProgram}
                </p>
              </div>
            </div>
          )}

          {!collapsed && (
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
          )}

          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition shrink-0"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
