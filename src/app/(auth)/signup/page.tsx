"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupUser, loginWithGoogle } from "@/context/authService";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthRedirect from "@/context/AuthRedirect";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      await signupUser(email, password);

      router.push("/student/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      await loginWithGoogle();

      router.push("/student/profile");
    } catch {
      setError("Google signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>

          <p className="text-slate-400 mt-2">
            Start practicing exams smarter today.
          </p>

          <div className="mt-6 space-y-4">
            <Input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              variant="primary"
              fullWidth
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-700 flex-1" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                or
              </span>
              <div className="h-px bg-slate-700 flex-1" />
            </div>

            <Button
              variant="secondary"
              fullWidth
              onClick={handleGoogle}
              disabled={loading}
            >
              Continue with Google
            </Button>
          </div>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </AuthRedirect>
  );
}
