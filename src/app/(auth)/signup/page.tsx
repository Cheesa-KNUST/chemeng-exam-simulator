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

    setError("");
    setShowModal(true);
  };

  const handleCompleteSignup = async () => {
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
    } catch (err) {
      console.error(err);
      setError("Signup failed.");
    } finally {
      setLoading(false);
    }

    if (!username || !program || !semester || !level) {
      setError("Please complete all fields.");
      return;
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
              onClick={handleSignup}
              className="w-full"
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
              onClick={handleGoogle}
              disabled={loading}
              className="w-full"
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

        {showModal && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-slate-800">
              <h2 className="text-xl font-semibold text-white">
                Complete your profile
              </h2>

              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                placeholder="Program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              />

              <Input
                placeholder="Semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />

              <Input
                placeholder="Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="w-full"
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  onClick={handleCompleteSignup}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Finish"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthRedirect>
  );
}
