"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupUser, signupWithGoogle } from "@/context/authService";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthRedirect from "@/context/AuthRedirect";

import { BookOpen, ArrowRight } from "lucide-react";

const PROGRAMS = ["Chemical Engineering"];
const LEVELS = ["100", "200", "300", "400"];
const SEMESTERS = ["1", "2"];

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [username, setUsername] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [level, setLevel] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  const handleCompleteSignup = async () => {
    if (!username || !program || !semester || !level) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signupUser(email, password, {
        username,
        program,
        semester,
        level,
      });

      router.replace("/student");
    } catch {
      setError("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      const { isNewUser } = await signupWithGoogle();

      if (isNewUser) {
        router.replace("/onboarding");
      } else {
        router.replace("/student");
      }
    } catch {
      setError("Google signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <main className="min-h-screen bg-slate-950 flex">
        <div className="hidden lg:flex flex-col justify-between w-105 shrink-0 bg-slate-900 border-r border-slate-800 p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-600/15 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-15 -left-15 w-56 h-56 rounded-full bg-blue-800/10 blur-[60px] pointer-events-none" />

          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              CHEM<span className="text-blue-400">ENG</span>
            </span>
          </div>

          <div className="relative z-10 space-y-5">
            <h2 className="text-2xl font-bold text-white leading-snug">
              Your exam performance starts here.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join your classmates on the only exam simulator built specifically
              for Chemical Engineering students. Practice past papers, track
              your progress, and study with friends.
            </p>

            <div className="space-y-2.5">
              {[
                "Timed exam simulation",
                "AI-powered explanations",
                "Performance analytics dashboard",
                "Multiplayer exam rooms",
                "Unlimited retakes — always free",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                  <p className="text-slate-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-600 relative z-10">
            © CHEESA Tratech Committee
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              CHEM<span className="text-blue-400">ENG</span>
            </span>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight">
                Create account
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                Start practising smarter today — it&apos;s free.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white text-sm font-medium px-4 py-3 rounded-xl transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-xs text-slate-600 uppercase tracking-widest">
                  or
                </span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              <Input
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder="Password (min. 6 characters)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              />

              {error && !showModal && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
              >
                Continue
                <ArrowRight size={15} />
              </button>
            </div>

            <p className="text-sm text-slate-500 mt-8 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">One last step</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Tell us a bit about yourself so we can personalise your
                  experience.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Username
                </label>
                <Input
                  placeholder="e.g. Kwame A."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Program
                </label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => (
                    <label
                      key={l}
                      className={`flex items-center justify-center px-5 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${
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
                      Level {l}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Semester
                </label>
                <div className="flex gap-2">
                  {SEMESTERS.map((s) => (
                    <label
                      key={s}
                      className={`flex-1 flex items-center justify-center py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${
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

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <button
                  onClick={handleCompleteSignup}
                  disabled={
                    loading || !username || !program || !semester || !level
                  }
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthRedirect>
  );
}
