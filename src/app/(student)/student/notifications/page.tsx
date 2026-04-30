"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Notification, listenToNotifications } from "@/context/userService";
import PageHeader from "@/components/layout/PageHeader";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import { CheckCircle2, AlertTriangle, Info, Bell } from "lucide-react";

function getTypeStyles(type?: string) {
  switch (type) {
    case "success":
      return {
        card: "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10",
        icon: (
          <CheckCircle2
            size={16}
            className="text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0"
          />
        ),
      };
    case "warning":
      return {
        card: "border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10",
        icon: (
          <AlertTriangle
            size={16}
            className="text-amber-500 dark:text-amber-400 mt-0.5 shrink-0"
          />
        ),
      };
    case "info":
    default:
      return {
        card: "border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10",
        icon: (
          <Info
            size={16}
            className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0"
          />
        ),
      };
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToNotifications((data) => {
      setNotifications(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Notifications"
          subtitle="Updates, alerts, and system messages"
        />

        {loading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <EmptyState
            icon={<Bell size={22} />}
            title="No notifications yet"
            description="Updates and alerts from your lecturers will appear here"
          />
        )}

        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n) => {
              const { card, icon } = getTypeStyles(n.type);
              return (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border transition-opacity ${card} ${
                    n.read ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {icon}
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {n.title}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {n.message}
                        </p>
                      </div>
                    </div>

                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
