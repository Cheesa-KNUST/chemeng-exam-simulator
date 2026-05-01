"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">
          Complete your profile
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Just a few details to personalize your experience.
        </p>

        <form onSubmit={handleOnboarding} className="mt-6 space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="Program (e.g. Computer Science)"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />

          <div className="flex gap-3">
            <Input
              placeholder="Level e.g 100,200..."
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />

            <Input
              placeholder="Semester e.g. 1,2..."
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
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
