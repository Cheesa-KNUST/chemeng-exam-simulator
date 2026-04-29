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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-blue-400" />
        <h3 className="text-white font-semibold">{title}</h3>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="w-full mx-auto space-y-10 px-6 md:px-10">
      <div className="sticky top-0 z-40 -mx-6 md:-mx-10 mb-6">
        <div className="backdrop-blur-xl bg-slate-950/70 border-b border-slate-800 px-6 md:px-10 py-4">
          <div className="flex items-start gap-3">
            <Link
              href="/"
              className="w-12 h-12 rounded-full flex items-center justify-center"
              aria-label="Go Home"
            >
              <Home size={30} />
            </Link>

            <div>
              <h1 className="text-white text-lg font-semibold">
                About ChemEng Exam Simulator
              </h1>

              <p className="text-slate-400 text-sm">
                A modern AI-powered learning platform designed to help
                engineering students practice, improve, and excel.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <Sparkles size={18} className="text-blue-400" />
          Platform Overview
        </h2>

        <p className="text-slate-300 text-sm leading-relaxed">
          ChemEng Exam Simulator is a structured academic practice system built
          specifically for chemical engineering students. It enables users to
          simulate real exam environments, attempt past questions, and track
          performance over time.
        </p>

        <p className="text-slate-300 text-sm leading-relaxed">
          The platform focuses on active learning — not passive reading —
          combining timed assessments, instant feedback, and progress analytics
          to accelerate mastery.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FeatureCard
          icon={Brain}
          title="Smart Exam Simulation"
          description="Replicates real exam conditions with timers, structured questions, and controlled navigation."
        />

        <FeatureCard
          icon={BarChart3}
          title="Performance Analytics"
          description="Track scores, progress trends, and weak areas across all courses and attempts."
        />

        <FeatureCard
          icon={Zap}
          title="Instant Feedback"
          description="Get immediate explanations and performance insights after submission."
        />

        <FeatureCard
          icon={Target}
          title="Focused Learning"
          description="Designed to reduce distractions and improve retention through structured practice."
        />
      </div>

      <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 space-y-4">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <ShieldCheck size={18} className="text-blue-400" />
          What Makes This Different
        </h2>

        <ul className="space-y-3 text-slate-300 text-sm">
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Built specifically for Chemical Engineering students
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Real exam simulation instead of passive learning
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Clean, distraction-free interface optimized for focus
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Real-time sync across devices and sessions
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Data-driven learning progression system
          </li>
        </ul>
      </div>

      <div className="text-center text-slate-500 text-sm pt-2 pb-6">
        Built for students who want to learn smarter, not harder.
      </div>
    </div>
  );
}
