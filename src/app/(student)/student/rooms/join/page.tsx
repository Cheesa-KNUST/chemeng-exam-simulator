"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";

export default function JoinRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();

  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (profile?.username) setDisplayName(profile.username);
  }, [profile]);

  const handleJoin = async () => {
    setError("");
    const trimmedCode = code.trim().toUpperCase();

    if (trimmedCode.length !== 6)
      return setError("Room code must be 6 characters");
    if (!displayName.trim()) return setError("Please enter a display name");
    if (!user?.uid) return setError("You must be logged in");

    try {
      setJoining(true);

      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: trimmedCode,
          userId: user.uid,
          displayName: displayName.trim(),
        }),
      });

      const body = await res.json();

      if (!res.ok) throw new Error(body.error ?? "Failed to join room");

      router.push(`/student/rooms/${body.room.code}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setJoining(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Join a room"
        subtitle="Enter the room code shared by your friend"
      />

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Room code
            </label>
            <input
              type="text"
              placeholder="e.g. XK9F2M"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-mono tracking-widest text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Your name
            </label>
            <input
              type="text"
              placeholder="How others will see you"
              maxLength={60}
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            disabled={joining}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleJoin} disabled={joining}>
            {joining ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Joining...
              </span>
            ) : (
              "Join room"
            )}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
