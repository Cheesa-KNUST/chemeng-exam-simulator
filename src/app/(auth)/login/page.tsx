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

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showResetModal, setShowResetModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      await loginUser(email, password);

      router.replace("/student");
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      const { isNewUser } = await loginWithGoogle();

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
    } catch (err) {
      console.error(err);
      setError("Failed to send reset email.");
    } finally {
      setLoading(false);
      setShowResetModal(false);
    }
  };

  return (
    <AuthRedirect>
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>

          <p className="text-slate-400 mt-2">
            Login to continue your exam practice.
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
              onClick={handleLogin}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            <p className="text-sm text-slate-400 text-center">
              Forget Password?{" "}
              <span
                onClick={() => setShowResetModal(true)}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Reset
              </span>
            </p>

            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-700 flex-1" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                or
              </span>
              <div className="h-px bg-slate-700 flex-1" />
            </div>

            <Button
              variant="secondary"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full"
            >
              Continue with Google
            </Button>
          </div>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Don`t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {showResetModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-slate-800">
              <h2 className="text-xl font-semibold text-white">
                Reset Password
              </h2>

              <p className="text-sm text-slate-400">
                We`ll send a password reset link to:
              </p>

              <Input
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {message && <p className="text-green-400 text-sm">{message}</p>}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowResetModal(false);
                    setError("");
                    setMessage("");
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  onClick={handleResetPassword}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthRedirect>
  );
}
