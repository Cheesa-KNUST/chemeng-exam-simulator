"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Notification,
  listenToNotifications,
  listenToUserSettings,
} from "@/context/userService";
import PageHeader from "@/components/layout/PageHeader";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, AlertTriangle, Info, Bell, BellOff } from "lucide-react";

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

type UserSettings = {
  notifications: boolean;
};

export default function NotificationsPage() {
  const { user } = useAuth();

  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsub = listenToUserSettings(user.uid, (data) => {
      setSettings(data);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user || !settings.notifications) return;

    const unsub = listenToNotifications((data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user, settings.notifications]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Notifications"
          subtitle="Updates, alerts, and system messages"
        />

        {loading && (
          <div className="flex justify-center py-10">
            <Loader size="lg" label="Loading notifications ......" />
          </div>
        )}

        {!loading && !settings.notifications && (
          <EmptyState
            icon={<BellOff size={22} />}
            title="Notifications are turned off"
            description="You are not receiving notifications. Enable them in settings to stay updated."
            action={
              <Link href="/student/settings">
                <Button variant="primary">Go to settings</Button>
              </Link>
            }
          />
        )}

        {!loading && settings.notifications && notifications.length === 0 && (
          <EmptyState
            icon={<Bell size={22} />}
            title="No notifications yet"
            description="Updates will appear here"
          />
        )}

        {!loading && settings.notifications && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n) => {
              const { card, icon } = getTypeStyles(n.type);

              return (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border ${card} ${
                    n.read ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {icon}
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          Title: {n.title}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          Message: {n.message}
                        </p>
                      </div>
                    </div>

                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
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
