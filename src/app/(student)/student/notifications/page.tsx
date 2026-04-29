"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Notification, listenToNotifications } from "@/context/userService";
import PageHeader from "@/components/layout/PageHeader";
import Loader from "@/components/ui/Loader";

function getTypeStyles(type?: string) {
  switch (type) {
    case "success":
      return "border-emerald-500/30 bg-emerald-500/10";
    case "warning":
      return "border-yellow-500/30 bg-yellow-500/10";
    case "info":
    default:
      return "border-blue-500/30 bg-blue-500/10";
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
          <div className="text-center py-16 border border-slate-800 rounded-2xl bg-slate-900">
            <p className="text-slate-400">No notifications yet</p>
          </div>
        )}

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`
                p-4 rounded-xl border transition
                ${getTypeStyles(n.type)}
                ${n.read ? "opacity-60" : "opacity-100"}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{n.title}</p>
                  <p className="text-sm text-slate-300 mt-1">{n.message}</p>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
