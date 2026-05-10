"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";

import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

import { useAuth } from "@/context/AuthContext";
import { ExamRoom, RoomParticipant } from "@/helpers/rooms/room.types";

import {
  Users,
  Copy,
  Check,
  ShuffleIcon,
  Eye,
  Trophy,
  PlayCircle,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";

type LobbyData = {
  room: ExamRoom;
  participants: RoomParticipant[];
};

export default function RoomLobbyPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;

  const [data, setData] = useState<LobbyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchLobby = useCallback(
    async (isInitial = false) => {
      try {
        const res = await fetch(`/api/rooms/${code}`);
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to load room");
        }
        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (isInitial) setLoading(false);
      }
    },
    [code],
  );

  useEffect(() => {
    fetchLobby(true);
  }, [fetchLobby]);

  useEffect(() => {
    const interval = setInterval(fetchLobby, 8000);
    return () => clearInterval(interval);
  }, [fetchLobby]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartExam = async () => {
    if (!uid) return;
    try {
      setStarting(true);

      const res = await fetch(`/api/rooms/${code}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to start exam");

      router.push(`/student/rooms/${code}/exam`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStarting(false);
    }
  };

  const handleCloseRoom = async () => {
    if (!uid || !isCreator) return;
    const confirmed = window.confirm(
      "Close this room? No new participants can join or start the exam, but anyone already in the exam can finish.",
    );
    if (!confirmed) return;

    try {
      setClosing(true);

      const res = await fetch(`/api/rooms/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to close room");

      await fetchLobby();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setClosing(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!uid || !isCreator) return;
    const confirmed = window.confirm(
      "Permanently delete this room? This removes all results, attempts, and participant data. This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setDeleting(true);

      const res = await fetch(`/api/rooms/${code}?userId=${uid}`, {
        method: "DELETE",
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to delete room");

      router.push("/student/rooms");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <AppShell>
        <Loader size="lg" label="Loading room..." />
      </AppShell>
    );

  if (error || !data) {
    return (
      <AppShell>
        <div className="min-h-[70vh] flex items-center justify-center">
          <EmptyState
            icon={<AlertCircle size={28} />}
            title={error ? "Unable to load room" : "Room not found"}
            description={
              error ||
              "The room may have been removed, expired, or the code is invalid."
            }
            action={
              <Button
                variant="secondary"
                onClick={() => router.push("/student/rooms")}
              >
                Back to Study Rooms
              </Button>
            }
          />
        </div>
      </AppShell>
    );
  }

  const { room, participants } = data;
  const isCreator = room.creatorId === uid;
  const myParticipant = participants.find((p) => p.userId === uid);
  const myStatus = myParticipant?.status;
  const isClosed = room.status === "closed";

  const statusIcon = {
    joined: <Clock size={13} className="text-slate-400" />,
    in_progress: <Loader2 size={13} className="text-blue-500 animate-spin" />,
    completed: <CheckCircle2 size={13} className="text-emerald-500" />,
  };

  return (
    <AppShell>
      <PageHeader
        title={room.title}
        subtitle={`Room · ${room.source.examId}`}
        action={
          <div className="flex items-center gap-2">
            {myStatus === "completed" && room.settings.showLeaderboard && (
              <Button
                variant="secondary"
                onClick={() =>
                  router.push(`/student/rooms/${code}/leaderboard`)
                }
              >
                <span className="flex items-center gap-2">
                  <Trophy size={15} />
                  Leaderboard
                </span>
              </Button>
            )}
            {isCreator && !isClosed && (
              <Button
                variant="danger"
                onClick={handleCloseRoom}
                disabled={closing}
              >
                {closing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Closing...
                  </span>
                ) : (
                  "Close room"
                )}
              </Button>
            )}
            {isCreator && isClosed && (
              <Button
                variant="danger"
                onClick={handleDeleteRoom}
                disabled={deleting}
              >
                {deleting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete room"
                )}
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              Room code
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-3xl font-bold font-mono tracking-widest text-slate-800 dark:text-slate-100">
                {code.toUpperCase()}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                title="Copy code"
              >
                {copied ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              Share this code with friends to invite them
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              Settings
            </p>
            <div className="space-y-2.5">
              <SettingRow
                icon={<ShuffleIcon size={14} />}
                label="Shuffle questions"
                enabled={room.settings.shuffleQuestions}
              />
              <SettingRow
                icon={<ShuffleIcon size={14} />}
                label="Shuffle options"
                enabled={room.settings.shuffleOptions}
              />
              <SettingRow
                icon={<Eye size={14} />}
                label="Allow review"
                enabled={room.settings.allowReview}
              />
              <SettingRow
                icon={<Trophy size={14} />}
                label="Leaderboard"
                enabled={room.settings.showLeaderboard}
              />
            </div>
          </div>

          {!isClosed && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              {!myParticipant ? (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    You haven&apos;t joined this room yet.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      router.push(`/student/rooms/join?code=${code}`)
                    }
                    className="w-full justify-center"
                  >
                    Join room
                  </Button>
                </div>
              ) : myStatus === "completed" ? (
                <div className="text-center">
                  <CheckCircle2
                    size={28}
                    className="text-emerald-500 mx-auto mb-2"
                  />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Exam submitted
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-3">
                    Score: {myParticipant.score ?? "—"}%
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      router.push(`/student/rooms/${code}/results`)
                    }
                    className="w-full justify-center"
                  >
                    View my results
                  </Button>
                </div>
              ) : myStatus === "in_progress" ? (
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                    Exam in progress
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/student/rooms/${code}/exam`)}
                    className="w-full justify-center"
                  >
                    <span className="flex items-center gap-2">
                      <PlayCircle size={15} />
                      Resume exam
                    </span>
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    Ready when you are. Once you start, the timer begins.
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleStartExam}
                    disabled={starting}
                    className="w-full justify-center"
                  >
                    {starting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Starting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <PlayCircle size={15} />
                        Start exam
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {isClosed && (
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                This room is closed
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Participants
              </p>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <Users size={13} />
                {participants.length}
              </span>
            </div>

            {participants.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
                No one has joined yet
              </p>
            ) : (
              <div className="space-y-2">
                {participants.map((p) => (
                  <div
                    key={p.userId}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                        {p.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                          {p.displayName}
                          {p.userId === uid && (
                            <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              You
                            </span>
                          )}
                          {p.userId === room.creatorId && (
                            <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                              Host
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      {statusIcon[p.status]}
                      <span className="capitalize">
                        {p.status.replace("_", " ")}
                      </span>
                      {p.status === "completed" && p.score !== null && (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
                          {p.score}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isCreator && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Updates every 8 seconds ·{" "}
                  {participants.filter((p) => p.status === "completed").length}/
                  {participants.length} completed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SettingRow({
  icon,
  label,
  enabled,
}: {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
        <span className="text-slate-400 dark:text-slate-500">{icon}</span>
        {label}
      </span>
      <span
        className={`text-xs font-semibold ${
          enabled
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {enabled ? "On" : "Off"}
      </span>
    </div>
  );
}
