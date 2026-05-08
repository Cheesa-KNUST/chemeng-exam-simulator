"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "../courses/utils/useToast";

import {
  createNotification,
  scheduleNotification,
  deleteNotification,
  deleteScheduledNotification,
  listenToNotifications,
  listenToScheduledNotifications,
  type Notification,
  type ScheduledNotification,
} from "@/lib/firestoreService";

import { auth } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import { Trash2, Send, Clock, Bell } from "lucide-react";

const TYPES = ["info", "success", "warning"] as const;

export default function AdminNotificationsPage() {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "success" | "warning">("info");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledNotification[]>([]);

  const [targetLevel, setTargetLevel] = useState("");
  const [targetSemester, setTargetSemester] = useState("");
  const [targetProgram, setTargetProgram] = useState("");

  const isTargeted = Boolean(targetLevel || targetSemester || targetProgram);

  useEffect(() => {
    const unsub1 = listenToNotifications(setNotifications);
    const unsub2 = listenToScheduledNotifications(setScheduled);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const pendingScheduled = scheduled.filter((s) => !s.sent);

  const handleSend = async () => {
    if (!title || !message) {
      toast("Title and message are required", false);
      return;
    }

    try {
      setLoading(true);
      const uid = auth.currentUser?.uid ?? "admin";

      if (isScheduled && scheduledAt) {
        await scheduleNotification({
          title,
          message,
          type,
          scheduledAt: Timestamp.fromDate(new Date(scheduledAt)),
          createdBy: uid,
          targetAudience: isTargeted ? "specific" : "all",

          ...(targetLevel && { targetLevel }),
          ...(targetSemester && { targetSemester }),
          ...(targetProgram && { targetProgram }),
        });
        toast("Notification scheduled", true);
      } else {
        await createNotification({
          title,
          message,
          type,
          targetAudience: isTargeted ? "specific" : "all",

          ...(targetLevel && { targetLevel }),
          ...(targetSemester && { targetSemester }),
          ...(targetProgram && { targetProgram }),
        });
        toast("Notification sent", true);
      }

      setTitle("");
      setMessage("");
      setIsScheduled(false);
      setScheduledAt("");
      setTargetLevel("");
      setTargetProgram("");
      setTargetSemester("");
    } catch (err) {
      console.error(err);
      toast("Failed to send notification", false);
    } finally {
      setLoading(false);
    }
  };

  const typeStyles = {
    info: "bg-blue-600 border-blue-500 text-white",
    success: "bg-emerald-600 border-emerald-500 text-white",
    warning: "bg-amber-500 border-amber-400 text-white",
  };

  return (
    <AppShell>
      <PageHeader
        title="Notifications"
        subtitle="Send and schedule notifications for your students."
      />

      <Card className="mb-8 space-y-5">
        <SectionTitle
          title="Compose Notification"
          description="Sends to all students immediately or at a scheduled time."
        />

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Type
          </label>
          <div className="flex gap-2">
            {TYPES.map((t) => (
              <label
                key={t}
                className={`px-4 py-2 rounded-lg border cursor-pointer text-sm capitalize transition-colors ${
                  type === t
                    ? typeStyles[t]
                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-500"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === t}
                  onChange={() => setType(t)}
                  className="sr-only"
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScheduled((v) => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              isScheduled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                isScheduled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Schedule for later
          </span>
        </div>

        {isScheduled && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Schedule Time
            </label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Target Audience{" "}
            <span className="text-xs font-normal text-slate-400">
              (leave blank to send to everyone)
            </span>
          </label>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Program</label>
              <select
                value={targetProgram}
                onChange={(e) => setTargetProgram(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All programs</option>
                {["Chemical Engineering", "Petrochemical Engineering"].map(
                  (p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Level</label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All levels</option>
                {["100", "200", "300", "400"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Semester</label>
              <select
                value={targetSemester}
                onChange={(e) => setTargetSemester(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All semesters</option>
                {["1", "2"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isTargeted && (
            <p className="text-xs text-blue-500 dark:text-blue-400">
              Sending to:{" "}
              {[
                targetLevel && `Level ${targetLevel}`,
                targetSemester && `Semester ${targetSemester}`,
                targetProgram,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </div>

        <Button
          variant="primary"
          onClick={handleSend}
          disabled={loading || !title || !message}
          className="flex items-center gap-2"
        >
          {isScheduled ? <Clock size={16} /> : <Send size={16} />}
          {loading ? "Sending..." : isScheduled ? "Schedule" : "Send Now"}
        </Button>
      </Card>

      <SectionTitle
        title="Scheduled"
        description="Pending notifications queued for delivery."
      />

      <div className="space-y-3 mb-8">
        {pendingScheduled.length === 0 ? (
          <EmptyState
            icon={<Clock size={20} />}
            title="No scheduled notifications"
            description="Notifications you schedule will appear here."
          />
        ) : (
          pendingScheduled.map((s) => (
            <Card
              key={s.id}
              className="p-4 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">
                  {s.title}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {s.message}
                </p>
                <p className="text-slate-500 text-xs flex items-center gap-1">
                  <Clock size={12} />
                  {s.scheduledAt?.toDate().toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => deleteScheduledNotification(s.id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </Card>
          ))
        )}
      </div>

      <SectionTitle
        title="Sent Notifications"
        description="All broadcast notifications sent to students."
      />

      <div className="space-y-3 mb-12">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={20} />}
            title="No notifications yet"
            description="Send a notification to get started."
            action={
              <Button
                variant="primary"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Create Notification
              </Button>
            }
          />
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              className="p-4 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <Bell
                  size={16}
                  className="text-slate-500 dark:text-slate-400 mt-0.5"
                />
                <div className="space-y-1">
                  <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">
                    {n.title}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {n.message}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {n.createdAt?.toDate().toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => deleteNotification(n.id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
