import Link from "next/link";
import AuthRedirect from "@/context/AuthRedirect";
import {
  Brain,
  BarChart3,
  Clock,
  Users,
  Trophy,
  Zap,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  return (
    <AuthRedirect>
      <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-150 h-150 rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[5%] w-100 h-100 rounded-full bg-blue-800/8 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <header className="relative z-10 border-b border-slate-800/60 backdrop-blur-sm bg-slate-950/50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                <BookOpen size={14} className="text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">
                CHEM<span className="text-blue-400">ENG</span>
              </h1>
            </div>

            <nav className="flex items-center gap-2">
              <Link
                href="/about"
                className="text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                About
              </Link>
              <Link
                href="/login"
                className="text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                Log in
              </Link>
            </nav>
          </div>
        </header>

        <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Built for Chemical Engineering Students
            </div>

            <h2 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Practice exams.
              <br />
              <span className="text-blue-400">Understand more.</span>
              <br />
              Score higher.
            </h2>

            <p className="text-slate-300 text-lg leading-relaxed max-w-xl mb-10">
              A structured exam simulator with timed assessments, AI-powered
              explanations, performance analytics, and collaborative study rooms
              — designed from the ground up for ChemEng students.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/signup">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
                  Start for free
                  <ArrowRight size={15} />
                </button>
              </Link>
              <Link href="/about">
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-6 py-3 rounded-xl border border-slate-700 transition-colors">
                  Learn more
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-5">
              {[
                "No setup required",
                "Unlimited retakes",
                "Instant grading",
                "AI explanations",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-sm text-slate-400"
                >
                  <CheckCircle2
                    size={13}
                    className="text-emerald-400 shrink-0"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-3 absolute top-24 right-6 w-56">
            {[
              {
                label: "Questions answered",
                value: "10,000+",
                color: "text-blue-400",
              },
              {
                label: "Avg score improvement",
                value: "+23%",
                color: "text-emerald-400",
              },
              {
                label: "Exams available",
                value: "50+",
                color: "text-amber-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl px-5 py-4"
              >
                <p className={`text-2xl font-black ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="border-t border-slate-800" />
        </div>

        <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              Everything you need
            </p>
            <h3 className="text-3xl font-bold text-white">
              Built around how students actually learn
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Clock,
                title: "Timed exam simulation",
                body: "Real countdown timers that auto-submit when time runs out. The timer turns red under 90 seconds — exactly like the real thing.",
                accent: "bg-blue-500/10 border-blue-500/20 text-blue-400",
              },
              {
                icon: Zap,
                title: "AI explanations",
                body: "Every question has an on-demand AI explanation — not just the right answer, but why it's right and why the others aren't.",
                accent: "bg-amber-500/10 border-amber-500/20 text-amber-400",
              },
              {
                icon: BarChart3,
                title: "Performance analytics",
                body: "Track scores across all attempts. See your average per course, grade distribution, and weekly study activity in one dashboard.",
                accent:
                  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
              },
              {
                icon: Users,
                title: "Exam rooms",
                body: "Create a private room, share the 6-character code, and take the same exam with friends — asynchronously. Compare results on a leaderboard.",
                accent: "bg-purple-500/10 border-purple-500/20 text-purple-400",
              },
              {
                icon: Brain,
                title: "Multiple question types",
                body: "MCQ, True/False, Fill-in-the-blank with numerical tolerance, and pictorial questions — covering every format you'll face.",
                accent: "bg-blue-500/10 border-blue-500/20 text-blue-400",
              },
              {
                icon: Trophy,
                title: "Leaderboards",
                body: "Room leaderboards rank by score, with time taken as a tiebreaker. See where you stand against your study group after every session.",
                accent: "bg-amber-500/10 border-amber-500/20 text-amber-400",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${feature.accent}`}
                  >
                    <Icon size={18} />
                  </div>
                  <h4 className="text-white font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <div className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-800/50 border border-slate-800 rounded-3xl p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              Simple by design
            </p>
            <h3 className="text-2xl font-bold text-white mb-10">
              From zero to first result in minutes
            </h3>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Pick a course & exam",
                  body: "Browse courses filtered to your level and semester. Choose from past papers, midterms, and practicals.",
                },
                {
                  step: "02",
                  title: "Take the timed exam",
                  body: "Work through questions under real conditions. Flag anything to revisit. Navigate freely with the sidebar.",
                },
                {
                  step: "03",
                  title: "Review & improve",
                  body: "See your score instantly. Review every answer with AI explanations. Retake to reinforce what you got wrong.",
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <p className="text-6xl font-black text-slate-800 leading-none mb-3 select-none">
                    {item.step}
                  </p>
                  <p className="text-white font-semibold mb-2">{item.title}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <div className="relative overflow-hidden bg-blue-600 rounded-3xl px-8 py-14 text-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
            />
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-500/40 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-blue-700/40 blur-3xl" />

            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to start practising?
              </h3>
              <p className="text-blue-100 text-base mb-8 max-w-md mx-auto">
                Join your classmates on the platform built specifically for
                Chemical Engineering students.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/signup">
                  <button className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 text-sm font-bold px-7 py-3 rounded-xl transition-colors">
                    Create free account
                    <ArrowRight size={15} />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="flex items-center gap-2 bg-blue-500/40 hover:bg-blue-500/60 text-white text-sm font-semibold px-7 py-3 rounded-xl border border-blue-400/40 transition-colors backdrop-blur">
                    Log in
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-slate-800 mt-8">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
                <BookOpen size={12} className="text-white" />
              </div>
              <span className="text-sm font-bold">
                CHEM<span className="text-blue-400">ENG</span>
              </span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/about"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                About
              </Link>
              <Link
                href="/login"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>

            <p className="text-xs text-slate-600">
              Built by CHEESA Tratech Committee
            </p>
          </div>
        </footer>
      </main>
    </AuthRedirect>
  );
}
