"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

import { useAuth } from "@/context/AuthContext";
import { ExamRoom } from "@/helpers/rooms/room.types";

import { Users, Clock, ChevronRight, Plus, LogIn } from "lucide-react";

export default function RoomsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;

  const [rooms, setRooms] = useState<ExamRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    if (!uid) return;

    (async () => {
      try {
        const res = await fetch(`/api/rooms?userId=${uid}`);
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [uid]);

  const handleQuickJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) {
      setJoinError("Room code must be 6 characters");
      return;
    }
    router.push(`/student/rooms/join?code=${code}`);
  };

  if (loading)
    return (
      <AppShell>
        <Loader size="lg" label="Loading rooms..." />;
      </AppShell>
    );

  return (
    <AppShell>
      <PageHeader
        title="Exam Rooms"
        subtitle="Join a room to compete with friends or create your own"
        action={
          <Link href="/student/rooms/create">
            <Button variant="primary">
              <span className="flex items-center gap-2">
                <Plus size={15} />
                Create room
              </span>
            </Button>
          </Link>
        }
      />

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-6">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
          Join with a code
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. XK9F2M"
            maxLength={6}
            value={joinCode}
            onChange={(e) => {
              setJoinCode(e.target.value.toUpperCase());
              setJoinError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleQuickJoin()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-mono tracking-widest text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button variant="primary" onClick={handleQuickJoin}>
            <span className="flex items-center gap-2">
              <LogIn size={15} />
              Join
            </span>
          </Button>
        </div>
        {joinError && <p className="text-xs text-red-500 mt-2">{joinError}</p>}
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
            <Users size={22} className="text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
            No rooms yet
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
            Create a room or join one with a code above
          </p>
          <Link href="/student/rooms/create">
            <Button variant="primary">Create your first room</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
            Your rooms
          </p>
          {rooms.map((room) => (
            <RoomCard key={room.code} room={room} />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function RoomCard({ room }: { room: ExamRoom }) {
  const isCreator = (room as ExamRoom & { role: string }).role === "creator";

  const statusStyles = {
    open: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    closed:
      "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600",
  };

  return (
    <Link href={`/student/rooms/${room.code}`}>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all cursor-pointer mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
          <Users size={18} className="text-blue-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              Room Title: {room.title}
            </p>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border shrink-0 ${
                isCreator
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
              }`}
            >
              {isCreator ? "Host" : "Participant"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="font-mono tracking-widest">{room.code}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Users size={11} />
              {room.participantsCount}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {new Date(room.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${statusStyles[room.status]}`}
          >
            {room.status}
          </span>
          <ChevronRight
            size={16}
            className="text-slate-400 dark:text-slate-500"
          />
        </div>
      </div>
    </Link>
  );
}
