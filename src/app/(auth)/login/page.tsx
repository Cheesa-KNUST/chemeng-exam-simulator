"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  loginUser,
  loginWithGoogle,
  resetPassword,
} from "@/context/authService";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthRedirect from "@/context/AuthRedirect";

import { Eye, EyeOff, Check, BookOpen, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showResetModal, setShowResetModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await loginUser(email, password, rememberMe);
    } catch {
      setError("Invalid credentials.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      const { isNewUser } = await loginWithGoogle(rememberMe);

      if (isNewUser) {
        router.replace("/onboarding");
      }
    } catch {
      setError("Google signup failed.");
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await resetPassword(email);

      setMessage("Password reset email sent. Check your inbox.");
    } catch {
      setError("Failed to send reset email.");
    } finally {
      setLoading(false);
      setShowResetModal(false);
    }
  };

  return (
    <AuthRedirect>
      <main className="min-h-screen bg-slate-950 flex">
        <div className="hidden lg:flex flex-col justify-between w-105 shrink-0 bg-slate-900 border-r border-slate-800 p-10 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-600/15 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-15 -right-15 w-56 h-56 rounded-full bg-blue-800/10 blur-[60px] pointer-events-none" />

          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              CHEM<span className="text-blue-400">ENG</span>
            </span>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-3">
              <p className="text-2xl font-bold text-white leading-snug">
                &quot;The only way to learn is to practice — consistently.&quot;
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track your performance, understand your mistakes, and improve
                exam by exam. Your history is waiting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "50+", label: "Exams" },
                { value: "∞", label: "Retakes" },
                { value: "4", label: "Question types" },
                { value: "100%", label: "Free" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3"
                >
                  <p className="text-xl font-black text-blue-400">{s.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
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
                Welcome back
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                Sign in to continue your practice.
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />

              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRememberMe((p) => !p)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <div
                    className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-colors ${
                      rememberMe
                        ? "bg-blue-600 border-blue-600"
                        : "border-slate-600"
                    }`}
                  >
                    {rememberMe && <Check size={11} className="text-white" />}
                  </div>
                  Stay signed in
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {message && (
                <p className="text-emerald-400 text-sm bg-emerald-400/10 border border-emerald-400/20 px-3 py-2 rounded-lg">
                  {message}
                </p>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-slate-500 mt-8 text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {showResetModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Reset password</h2>
                <p className="text-slate-400 text-sm mt-1">
                  We&apos;ll send a reset link to your email.
                </p>
              </div>

              <Input
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-1">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowResetModal(false);
                    setError("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Sending..." : "Send link"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthRedirect>
  );
}
