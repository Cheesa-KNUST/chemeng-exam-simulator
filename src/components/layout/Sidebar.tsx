"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { studentNavItems } from "./navItems";
import { X, LogOut } from "lucide-react";

import { logoutUser } from "@/context/authService";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/context/userService";

type SidebarProps = {
  onClose?: () => void;
};

type SidebarProfile = {
  username?: string;
  program?: string;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState<SidebarProfile>({});

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserProfile(user.uid, (data: UserProfile | null) => {
      if (!data) return;

      setProfile({
        username: data.username,
        program: data.program,
      });
    });

    return () => unsubscribe();
  }, [user]);

  const isActive = (href: string) => {
    if (href === "/student") return pathname === "/student";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const fullName = profile.username || "Student";
  const nameParts = fullName.trim().split(" ").filter(Boolean);

  const displayName =
    nameParts.length >= 2 ? `${nameParts[0]} ${nameParts[1]}` : fullName;

  const avatarLetter = fullName.charAt(0).toUpperCase();

  const formatProgram = (program?: string) => {
    if (!program) return "Student";

    const words = program.trim().split(" ").filter(Boolean);

    if (words.length >= 2) {
      return words[0].slice(0, 4) + words[1].slice(0, 3);
    }

    return words[0].slice(0, 7);
  };

  const shortProgram = formatProgram(profile.program);

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen p-5 flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            CHEM<span className="text-blue-400">ENG</span>
          </h2>

          <p className="text-slate-400 text-xs mt-0.5 uppercase tracking-widest">
            Assessment System
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="space-y-1 flex-1">
        <p className="text-slate-500 text-xs uppercase tracking-widest px-3 mb-3">
          Menu
        </p>

        {studentNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm transition ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />

              {item.label}

              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              {avatarLetter}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium truncate max-w-30">
                {displayName}
              </p>

              <p className="text-xs text-slate-500">{shortProgram}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
