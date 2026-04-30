"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Bell, Sun, Moon } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/context/userService";
import { useTheme } from "@/context/useTheme";

type Props = {
  onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: Props) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = getUserProfile(user.uid, (data: UserProfile | null) => {
      setProfile(data);
    });

    return () => unsubscribe();
  }, [user]);

  const initials = (() => {
    const username = profile?.username?.trim();

    if (!username) return "U";

    const parts = username.split(" ").filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  })();

  return (
    <header className="h-25 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Open menu"
        >
          <Menu size={20} strokeWidth={2} />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
            ChemEng Exam Simulator
          </h1>

          <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            AI-powered departmental practice platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Link
          href="/student/notifications"
          className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Bell size={20} strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={20} strokeWidth={1.8} />
          ) : (
            <Moon size={20} strokeWidth={1.8} />
          )}
        </button>

        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />

        <Link
          href="/student/profile"
          title={profile?.username || "Profile"}
          className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm ring-2 ring-blue-200 dark:ring-blue-500 hover:ring-blue-400 transition"
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
