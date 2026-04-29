import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthRedirect from "@/context/AuthRedirect";
import { MessageCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <AuthRedirect>
      <main className="min-h-screen bg-slate-950 text-white">
        <header className="border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">
              CHEM<span className="text-blue-400">ENG</span>
            </h1>

            <div className="flex gap-3">
              <Link
                href="/about"
                className="mt-1 p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <MessageCircle size={20} />
              </Link>
            </div>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-5xl font-bold leading-tight max-w-4xl mx-auto">
            Practice Exams Smarter. Perform Better.
          </h2>

          <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
            Timed simulations, instant grading, detailed explanations, and
            performance insights for serious students.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/signup">
              <Button variant="primary">Start Free</Button>
            </Link>

            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="font-semibold text-lg">Timed Exams</h3>
            <p className="text-slate-400 mt-2 text-sm">
              Simulate real exam pressure with countdown timers.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="font-semibold text-lg">Instant Results</h3>
            <p className="text-slate-400 mt-2 text-sm">
              Get scores immediately with corrections and explanations.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="font-semibold text-lg">Performance Analytics</h3>
            <p className="text-slate-400 mt-2 text-sm">
              Track weak areas and improve strategically.
            </p>
          </div>
        </section>
      </main>
    </AuthRedirect>
  );
}
