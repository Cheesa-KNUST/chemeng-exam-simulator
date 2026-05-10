"use client";

import Link from "next/link";
import {
  Brain,
  BarChart3,
  Zap,
  Target,
  ShieldCheck,
  Home,
  Sparkles,
  Users,
  Trophy,
  BookOpen,
  Clock,
  Shuffle,
  Eye,
  MessageSquare,
  TrendingUp,
  Star,
  CheckCircle2,
  Layers,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
        <Icon size={18} className="text-blue-400" />
      </div>
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-slate-400 text-xs mt-1">{label}</p>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
      <CheckCircle2 size={14} className="text-blue-400 shrink-0 mt-0.5" />
      {children}
    </li>
  );
}

function RoadmapItem({
  status,
  title,
  description,
}: {
  status: "live" | "coming";
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
            status === "live"
              ? "bg-emerald-400"
              : "bg-slate-600 border-2 border-slate-500"
          }`}
        />
        <div className="w-px flex-1 bg-slate-800 mt-1" />
      </div>
      <div className="pb-5 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-white">{title}</p>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
              status === "live"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-slate-700/50 border-slate-600 text-slate-400"
            }`}
          >
            {status === "live" ? "Live" : "Coming soon"}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="w-full mx-auto space-y-10 px-6 md:px-10 pb-16 bg-slate-800">
      <div className="sticky top-0 z-40 -mx-6 md:-mx-10 mb-6">
        <div className="backdrop-blur-xl bg-slate-950/70 border-b border-slate-800 px-6 md:px-10 py-4">
          <div className="flex items-start gap-3">
            <Link
              href="/"
              className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="Go Home"
            >
              <Home size={24} />
            </Link>
            <div>
              <h1 className="text-white text-lg font-semibold">
                About ChemEng Exam Simulator
              </h1>
              <p className="text-slate-400 text-sm">
                A modern learning platform built for chemical engineering
                students
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 border border-blue-500/20 rounded-2xl p-8 space-y-4 shadow-2xl shadow-blue-950/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400/10 blur-3xl rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={20} className="text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
              Built for ChemEng Students
            </span>
          </div>

          <h2 className="text-white text-2xl font-bold leading-snug">
            Practice smarter. Understand deeper.{" "}
            <span className="text-blue-400">Score higher.</span>
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
            ChemEng Exam Simulator is a structured academic practice platform
            designed specifically for chemical engineering students.
          </p>

          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            The platform is built around one core belief: active recall through
            practice is the most effective way to learn.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard value="4+" label="Question types" />
        <StatCard value="∞" label="Retakes allowed" />
        <StatCard value="0" label="Distractions" />
        <StatCard value="100%" label="Student-focused" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-400" />
          <h2 className="text-white text-base font-bold">Core Features</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FeatureCard
            icon={Brain}
            title="Real Exam Simulation"
            description="Timed assessments with structured navigation, question flagging, and a sidebar overview — designed to replicate the pressure and format of real exams."
          />
          <FeatureCard
            icon={BarChart3}
            title="Performance Analytics"
            description="Track scores, spot trends, and identify weak subjects across all your attempts. The dashboard gives you a data-driven view of your progress over time."
          />
          <FeatureCard
            icon={Zap}
            title="Instant AI Explanations"
            description="After submission, tap 'More Explanation' on any question to get a detailed AI-powered breakdown of why an answer is correct — not just what the answer is."
          />
          <FeatureCard
            icon={Target}
            title="Focused Learning Environment"
            description="A distraction-free interface built for deep focus. No ads, no noise — just you and the exam. Dark mode supported throughout."
          />
          <FeatureCard
            icon={Users}
            title="Exam Rooms"
            description="Create private exam rooms, share a 6-character code with friends, and take the same exam independently. Compare results on a live leaderboard afterward."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Progress Tracking"
            description="Every result is saved to your history. See how your scores evolve across retakes, track your best performances, and measure improvement over time."
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-blue-400" />
          <h2 className="text-white text-base font-bold">How It Works</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Choose a course and exam",
              body: "Browse courses filtered to your level and semester. Pick any exam — past papers, midterms, or practicals.",
              icon: BookOpen,
            },
            {
              step: "02",
              title: "Take the exam",
              body: "Work through questions under timed conditions. Flag anything you want to revisit. Navigate freely with the sidebar.",
              icon: Clock,
            },
            {
              step: "03",
              title: "Learn from results",
              body: "Review your score, see where you went wrong, and use AI explanations to understand the gaps. Then retake.",
              icon: Star,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-700 leading-none">
                    {item.step}
                  </span>
                  <Icon size={16} className="text-blue-400" />
                </div>
                <p className="text-white text-sm font-semibold">{item.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-blue-400" />
          <h2 className="text-white text-base font-bold">
            Study Lobby — Exam Rooms
          </h2>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          The Study Lobby is a collaborative layer built on top of the exam
          engine. It lets groups of students take the same exam asynchronously —
          each on their own time — and compare results afterward.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              icon: <Shuffle size={14} className="text-blue-400" />,
              title: "Per-participant shuffle",
              body: "Each person gets a uniquely randomised question and option order, fixed at the moment they start. Refreshing won't change it.",
            },
            {
              icon: <Clock size={14} className="text-amber-400" />,
              title: "Server-anchored timers",
              body: "Timers are calculated from a server timestamp. Refreshing the page recalculates remaining time — it never resets.",
            },
            {
              icon: <Trophy size={14} className="text-amber-400" />,
              title: "Live leaderboard",
              body: "Rankings update as participants submit. Ties are broken by time taken — finishing faster wins the tiebreak.",
            },
            {
              icon: <Eye size={14} className="text-emerald-400" />,
              title: "Configurable settings",
              body: "Hosts control shuffle, review mode, and leaderboard visibility when creating the room.",
            },
            {
              icon: <ShieldCheck size={14} className="text-purple-400" />,
              title: "Host controls",
              body: "Hosts can close rooms to prevent new joiners and delete rooms entirely to clear all associated data.",
            },
            {
              icon: <MessageSquare size={14} className="text-blue-400" />,
              title: "Async-first design",
              body: "No real-time sync required. Join whenever you're ready, take the exam at your own pace, then check the leaderboard.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700"
            >
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-400" />
          <h2 className="text-white text-base font-bold">
            What Makes This Different
          </h2>
        </div>

        <ul className="space-y-3">
          <ListItem>
            Built exclusively for Chemical Engineering students — questions,
            courses, and difficulty levels are all tailored to the curriculum.
          </ListItem>
          <ListItem>
            Active recall over passive reading — the platform is built around
            the science of how people actually retain information.
          </ListItem>
          <ListItem>
            No ads, no upsells, no distractions. A clean interface built
            entirely around the student experience.
          </ListItem>
          <ListItem>
            Results and analytics are persistent — your entire history is saved
            so you can track long-term improvement, not just the last session.
          </ListItem>
          <ListItem>
            Server-side scoring — answers are graded on the backend using the
            exact same question order and options you saw, ensuring accuracy.
          </ListItem>
          <ListItem>
            Collaborative without requiring coordination — exam rooms work
            asynchronously so study groups don&apos;t need to schedule a time to
            sit together.
          </ListItem>
          <ListItem>
            AI explanations go beyond the answer — they explain the reasoning,
            the concept, and why the wrong options are wrong.
          </ListItem>
        </ul>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-400" />
          <h2 className="text-white text-base font-bold">Platform Roadmap</h2>
        </div>

        <div>
          <RoadmapItem
            status="live"
            title="Solo exam engine"
            description="Timed exams with question shuffle, flagging, sidebar navigation, and review mode."
          />
          <RoadmapItem
            status="live"
            title="Performance analytics dashboard"
            description="Score trends, course breakdowns, grade distribution, and weekly activity tracking."
          />
          <RoadmapItem
            status="live"
            title="AI-powered explanations"
            description="Per-question AI explanations available on the results page after submission."
          />
          <RoadmapItem
            status="live"
            title="Exam Rooms (Study Lobby)"
            description="Async multiplayer exam sessions with leaderboards, shuffle, and host controls."
          />
          {/* <RoadmapItem
            status="coming"
            title="Admin analytics"
            description="Faculty-facing dashboard to view aggregate performance, room data, and question difficulty metrics."
          /> */}
          {/* <RoadmapItem
            status="coming"
            title="Room management for admins"
            description="Bulk room cleanup, usage statistics, and the ability to create faculty-hosted exam sessions."
          /> */}
          <RoadmapItem
            status="coming"
            title="Tournaments"
            description="Bracket-style competitive exam tournaments with elimination rounds and rankings."
          />
          {/* <RoadmapItem
            status="coming"
            title="Mobile app"
            description="Native iOS and Android experience for studying on the go."
          /> */}
        </div>
      </div>

      <div className="text-center space-y-2 pt-2">
        <p className="text-slate-400 text-sm">
          Built for students who want to learn smarter, not harder.
        </p>
        <p className="text-slate-600 text-xs">
          For support, contact the{" "}
          <span className="text-slate-500 font-medium">
            CHEESA Tratech Committee
          </span>
        </p>
      </div>
    </div>
  );
}
