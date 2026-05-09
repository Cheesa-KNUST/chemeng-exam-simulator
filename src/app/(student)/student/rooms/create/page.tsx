"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";
import { getExamsByCourseSlug } from "@/helpers/exam/exam.service";
import { getCourses } from "@/helpers/courses/course.service";

type Exam = { id: string; title: string; courseSlug: string };
type Course = { slug: string; title: string };

type Settings = {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  showLeaderboard: boolean;
};

const defaultSettings: Settings = {
  shuffleQuestions: true,
  shuffleOptions: true,
  allowReview: true,
  showLeaderboard: true,
};

export default function CreateRoomPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [title, setTitle] = useState("");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getCourses(
          profile?.level ? Number(profile.level) : undefined,
          profile?.semester ? Number(profile.semester) : undefined,
        );

        if (!cancelled) setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile?.level, profile?.semester]);

  useEffect(() => {
    if (!selectedCourse) {
      setExams([]);
      setSelectedExam("");
      return;
    }

    (async () => {
      try {
        const data = await getExamsByCourseSlug(selectedCourse);
        setExams(data);
        setSelectedExam("");
      } catch {
        console.error("Failed to fetch exams");
      }
    })();
  }, [selectedCourse]);

  const toggleSetting = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !selectedExam || !user?.uid) return;

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          examId: selectedExam,
          creatorId: user.uid,
          settings,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to create room");
      }

      const room = await res.json();
      router.push(`/student/rooms/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = title.trim().length >= 3 && !!selectedExam;

  return (
    <AppShell>
      <PageHeader
        title="Create a room"
        subtitle="Set up a shared exam session for your classmates"
      />

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Room details
          </p>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
              Room title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Thermo Midterm Challenge"
              maxLength={100}
              className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
              Course
            </label>
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2.5 pr-8 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
              Exam
            </label>
            <div className="relative">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                disabled={!selectedCourse || exams.length === 0}
                className="w-full px-3 py-2.5 pr-8 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
              >
                <option value="">
                  {!selectedCourse
                    ? "Select a course first"
                    : exams.length === 0
                      ? "No exams available"
                      : "Select an exam"}
                </option>
                {exams.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Settings
          </p>

          {(
            [
              { key: "shuffleQuestions", label: "Shuffle questions" },
              { key: "shuffleOptions", label: "Shuffle answer options" },
              { key: "allowReview", label: "Allow review before submit" },
              { key: "showLeaderboard", label: "Show leaderboard" },
            ] as { key: keyof Settings; label: string }[]
          ).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {label}
              </span>
              <button
                onClick={() => toggleSetting(key)}
                className={`relative w-10 h-5.5 rounded-full transition-colors ${
                  settings[key]
                    ? "bg-blue-600"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                    settings[key] ? "translate-x-4.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Create room"
            )}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
