"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const PROGRAMS = ["Chemical Engineering"];

const LEVELS = ["100", "200", "300", "400"];
const SEMESTERS = ["1", "2"];

export default function OnboardingPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [level, setLevel] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace("/signup");
    }
  }, [router]);

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    if (!username || !program || !semester || !level) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username,
        program,
        semester,
        level,
        createdAt: new Date(),
      });

      router.replace("/student");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">
          Complete your profile
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Just a few details to personalize your experience.
        </p>

        <form onSubmit={handleOnboarding} className="mt-6 space-y-6">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-sm text-slate-400 font-medium">
              Program
            </label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>
                Select your program
              </option>
              {PROGRAMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Level Radio Buttons */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-medium">Level</label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <label
                  key={l}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                    level === l
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="level"
                    value={l}
                    checked={level === l}
                    onChange={() => setLevel(l)}
                    className="sr-only"
                  />
                  {l}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-medium">
              Semester
            </label>
            <div className="flex gap-2">
              {SEMESTERS.map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                    semester === s
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="semester"
                    value={s}
                    checked={semester === s}
                    onChange={() => setSemester(s)}
                    className="sr-only"
                  />
                  Semester {s}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || !username || !program || !semester || !level}
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </div>
    </main>
  );
}
