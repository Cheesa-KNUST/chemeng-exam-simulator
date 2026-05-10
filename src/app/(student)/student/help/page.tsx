"use client";

import { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Flag,
  Clock,
  MousePointerClick,
  BarChart3,
  Users,
  Trophy,
  ChevronDown,
  Zap,
  Shield,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Shuffle,
  Eye,
  Timer,
  Star,
  PlayCircle,
  LogIn,
  Copy,
  Lock,
  Trash2,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";

function Accordion({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {question}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
          {number}
        </div>
        <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-2" />
      </div>
      <div className="pb-6 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
          {title}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}

function Tip({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
      <div className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-0.5">
          {title}
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </section>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${color}`}
    >
      {label}
    </span>
  );
}

export default function HelpPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <HelpCircle size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Help & Documentation
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Everything you need to get the most out of ChemEng
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-16 z-20 flex flex-wrap gap-2 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md py-3">
          {[
            { label: "Getting Started", href: "#getting-started" },
            { label: "Taking Exams", href: "#taking-exams" },
            { label: "Question Types", href: "#question-types" },
            { label: "Timer & Submission", href: "#timer" },
            { label: "Results & Review", href: "#results" },
            { label: "Dashboard", href: "#dashboard" },
            { label: "Exam Rooms", href: "#rooms" },
            { label: "Settings", href: "#settings" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div id="getting-started" className="scroll-mt-30">
          <Section
            icon={<Zap size={18} />}
            title="Getting Started"
            subtitle="Your first steps on the platform"
          >
            <div className="space-y-0">
              <Step number={1} title="Browse your courses">
                Head to <span className="font-semibold">Courses</span> in the
                sidebar. You`ll see all available courses filtered to your level
                and semester. Pick a course to see the exams inside it.
              </Step>
              <Step number={2} title="Pick an exam">
                Each course has multiple exams — past papers, midterms,
                practicals, and more. Tap any exam to begin.
              </Step>
              <Step number={3} title="Configure your settings">
                Before starting, visit{" "}
                <span className="font-semibold">Settings</span> to toggle
                shuffle, review mode, and answer visibility to match how you
                want to study.
              </Step>
              <Step number={4} title="Take the exam and review">
                Work through the questions, submit when done, and review your
                results. Your score and performance are saved automatically to
                your history.
              </Step>
            </div>
          </Section>
        </div>

        <div id="taking-exams" className="scroll-mt-30">
          <Section
            icon={<BookOpen size={18} />}
            title="Taking Exams"
            subtitle="How the exam interface works"
          >
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The exam interface has two main areas: the{" "}
              <span className="font-semibold">question panel</span> on the right
              and the <span className="font-semibold">sidebar</span> on the
              left.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: <MousePointerClick size={15} />,
                  title: "Navigation",
                  body: "Use Previous / Next buttons or click any question dot in the sidebar to jump directly to that question.",
                },
                {
                  icon: <Flag size={15} />,
                  title: "Flagging",
                  body: "Flag questions you want to revisit. Flagged questions appear highlighted in the sidebar so you never lose track.",
                },
                {
                  icon: <CheckCircle2 size={15} />,
                  title: "Answering",
                  body: "Click your chosen option to select it. You can change your answer any time before submitting.",
                },
                {
                  icon: <RotateCcw size={15} />,
                  title: "Progress bar",
                  body: "The bar at the top fills as you move through questions, giving you a quick sense of where you are.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                >
                  <div className="text-blue-500 shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Tip icon={<Flag size={15} />} title="Use flags strategically">
              Flag hard questions and skip them first. Answer all the easy ones,
              then come back to flagged ones with your remaining time. The
              sidebar shows answered vs unanswered at a glance.
            </Tip>
          </Section>
        </div>

        <div id="question-types" className="scroll-mt-30">
          <Section
            icon={<BookOpen size={18} />}
            title="Question Types"
            subtitle="What to expect in each exam"
          >
            <div className="space-y-3">
              {[
                {
                  badge: {
                    label: "MCQ",
                    color:
                      "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
                  },
                  title: "Multiple Choice",
                  body: "Four or more options, one correct answer. Tap your choice — it highlights in blue. Tap again or choose another to change it.",
                },
                {
                  badge: {
                    label: "True / False",
                    color:
                      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
                  },
                  title: "True or False",
                  body: "A statement is given. Select True or False. These are usually faster to answer — don`t overthink them.",
                },
                {
                  badge: {
                    label: "Fill In",
                    color:
                      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
                  },
                  title: "Fill in the Blank",
                  body: "Type your answer directly. For numerical questions, enter just the number. Some questions accept a range or have a tolerance — so 9.81 and 9.8 might both be correct depending on the question.",
                },
                {
                  badge: {
                    label: "Image",
                    color:
                      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
                  },
                  title: "Pictorial MCQ",
                  body: "An image is shown alongside the question. Study the diagram carefully before selecting your answer.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge label={item.badge.label} color={item.badge.color} />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.title}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div id="timer" className="scroll-mt-30">
          <Section
            icon={<Timer size={18} />}
            title="Timer & Submission"
            subtitle="How timing and submission work"
          >
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Every exam has a time limit shown in the top-right corner. The
                timer counts down in real time. When it hits zero, your exam is
                submitted automatically with whatever answers you`ve entered.
              </p>
              <p>
                The timer turns{" "}
                <span className="font-semibold text-red-500">
                  red and pulses
                </span>{" "}
                when under 90 seconds — this is your cue to wrap up.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-2">
                  <Eye size={14} className="text-blue-500" />
                  With review mode on
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The Submit button takes you to a review screen first where you
                  can check all your answers before confirming.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" />
                  With review mode off
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The Submit button submits immediately — no confirmation step.
                  Use this for timed practice under exam conditions.
                </p>
              </div>
            </div>

            <Tip icon={<Clock size={15} />} title="Don't wait for the timer">
              Submit manually when you`re done — you don`t have to wait for time
              to run out. Early submission gives you a moment to breathe before
              checking your results.
            </Tip>
          </Section>
        </div>

        <div id="results" className="scroll-mt-30">
          <Section
            icon={<CheckCircle2 size={18} />}
            title="Results & Review"
            subtitle="Understanding your score after submission"
          >
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              After submitting, you`re taken to your results page. Here`s what
              you`ll see:
            </p>

            <div className="space-y-3">
              {[
                {
                  icon: <Star size={14} className="text-amber-400" />,
                  title: "Score and grade",
                  body: "Your percentage score and a grade label (Excellent, Good, Pass, Needs Work). The score bar fills to your percentage with a colour that reflects your grade.",
                },
                {
                  icon: <CheckCircle2 size={14} className="text-emerald-500" />,
                  title: "Correct / Wrong / Skipped",
                  body: "A breakdown of how many questions you got right, wrong, or left unanswered.",
                },
                {
                  icon: <Eye size={14} className="text-blue-500" />,
                  title: "Question review",
                  body: "Each question is shown with your answer and (if enabled in Settings) the correct answer. Green means correct, red means wrong, grey means skipped.",
                },
                {
                  icon: <Zap size={14} className="text-purple-500" />,
                  title: "AI Explanation",
                  body: "Tap `More Explanation` on any question to get a detailed AI-powered breakdown of why the answer is correct. Great for understanding concepts you got wrong.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                >
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Tip
              icon={<XCircle size={15} />}
              title="Wrong answers are valuable"
            >
              Don`t skip the review. Every wrong answer is an opportunity — use
              the AI explanation to understand the gap, then retake the exam to
              reinforce the concept.
            </Tip>
          </Section>
        </div>

        <div id="dashboard" className="scroll-mt-30">
          <Section
            icon={<BarChart3 size={18} />}
            title="Dashboard & Analytics"
            subtitle="Understanding your performance metrics"
          >
            <div className="space-y-3">
              {[
                {
                  title: "Attempted Courses",
                  body: "The number of unique courses you`ve engaged with. Each course is counted once regardless of how many exams you take within it.",
                },
                {
                  title: "Completed Exams",
                  body: "Total exams submitted. The weekly metric shows exams taken within the current calendar week (Sunday to Saturday).",
                },
                {
                  title: "Average Score",
                  body: "The average of all your exam scores. The trend arrow compares your recent weekly average against the previous week — up means improvement, down means decline.",
                },
                {
                  title: "Performance by Course",
                  body: "A bar chart showing your average score per course. Use this to identify subjects where you`re strong and ones that need more attention.",
                },
                {
                  title: "Score Distribution",
                  body: "Shows how your scores cluster across grade bands (A through F). A healthy distribution should skew toward A and B.",
                },
                {
                  title: "Weekly Activity",
                  body: "Your exam frequency over time. Consistency matters more than volume — a few exams a week beats cramming.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                >
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div id="rooms" className="scroll-mt-30">
          <Section
            icon={<Users size={18} />}
            title="Exam Rooms"
            subtitle="Compete and study with friends asynchronously"
          >
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Exam Rooms let you and your friends take the same exam
              independently and compare results afterward. No need to be online
              at the same time — everyone starts when they`re ready.
            </p>

            <div className="space-y-0">
              <Step number={1} title="Create a room">
                Go to <span className="font-semibold">Study Lobby</span> and tap{" "}
                <span className="font-semibold">Create room</span>. Pick a
                course, select an exam, give the room a title, and configure
                your settings (shuffle, leaderboard, review mode).
              </Step>
              <Step number={2} title="Share the code">
                A 6-character room code is generated (e.g.{" "}
                <span className="font-mono font-bold tracking-widest">
                  XK9F2M
                </span>
                ). Tap the{" "}
                <Copy size={12} className="inline-block align-middle" /> copy
                button in the lobby and share it with your friends.
              </Step>
              <Step number={3} title="Friends join">
                Friends enter the code on the{" "}
                <span className="font-semibold">Join a room</span> page (or type
                it directly on the Study Lobby home). They enter their display
                name and land in the lobby.
              </Step>
              <Step number={4} title="Everyone starts independently">
                Each participant taps{" "}
                <span className="font-semibold items-center gap-1 inline-flex">
                  <PlayCircle size={12} />
                  Start exam
                </span>{" "}
                when they`re ready. Timers are individual — your timer starts
                when you start, not when others do.
              </Step>
              <Step number={5} title="Compare results">
                After submitting, view your results and check the{" "}
                <span className="font-semibold">Leaderboard</span> to see how
                you ranked against everyone else. Rankings are by score, with
                time taken as a tiebreaker.
              </Step>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {[
                {
                  icon: <Shuffle size={14} className="text-blue-500" />,
                  title: "Shuffle",
                  body: "When enabled, each participant gets questions and options in a different random order — making collaboration during the exam harder.",
                },
                {
                  icon: <Eye size={14} className="text-emerald-500" />,
                  title: "Allow review",
                  body: "Controls whether participants can see a question-by-question breakdown of their answers on the results page.",
                },
                {
                  icon: <Trophy size={14} className="text-amber-400" />,
                  title: "Leaderboard",
                  body: "When enabled, all participants can see the ranked leaderboard after submitting. Turn it off for a private session.",
                },
                {
                  icon: <Shield size={14} className="text-purple-500" />,
                  title: "Server-side timer",
                  body: "Room exam timers are anchored to the server timestamp — refreshing the page doesn`t reset your timer.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                >
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 space-y-2">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <Shield size={14} />
                Host controls
              </p>
              <div className="space-y-2 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                <p className="flex items-start gap-2">
                  <Lock size={11} className="mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold">Close room</span> — stops
                    new participants from joining or starting the exam. Anyone
                    already in the exam can finish.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Trash2 size={11} className="mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold">Delete room</span> —
                    permanently removes the room and all associated results,
                    attempts, and participant data. Only available after
                    closing. Cannot be undone.
                  </span>
                </p>
              </div>
            </div>

            <Tip
              icon={<LogIn size={15} />}
              title="Already joined? No duplicate entry"
            >
              If you enter the same room code twice, you won`t be added twice.
              The system recognises you and takes you straight to the lobby.
            </Tip>
          </Section>
        </div>

        <div id="settings" className="scroll-mt-30">
          <Section
            icon={<Shield size={18} />}
            title="Settings"
            subtitle="Customise how you study"
          >
            <div className="space-y-3">
              {[
                {
                  icon: <Shuffle size={14} className="text-blue-500" />,
                  title: "Shuffle questions",
                  body: "Randomises the order of questions each time you start an exam. Great for avoiding pattern memorisation.",
                },
                {
                  icon: <Shuffle size={14} className="text-blue-400" />,
                  title: "Shuffle options",
                  body: "Randomises the order of answer choices. Works alongside question shuffle for a fully randomised experience.",
                },
                {
                  icon: <Eye size={14} className="text-emerald-500" />,
                  title: "Allow review",
                  body: "When on, the Submit button opens a review screen before final submission. When off, submission is immediate.",
                },
                {
                  icon: <CheckCircle2 size={14} className="text-purple-500" />,
                  title: "Show correct answers",
                  body: "Controls whether correct answers are shown on your results page. Turn off for a harder self-assessment.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                >
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Tip icon={<Star size={15} />} title="Recommended study setup">
              Shuffle both questions and options, enable review mode, and show
              correct answers. This gives you the most realistic exam experience
              while still letting you learn from mistakes.
            </Tip>
          </Section>
        </div>

        <div id="faq" className="scroll-mt-30">
          <Section
            icon={<HelpCircle size={18} />}
            title="Frequently Asked Questions"
          >
            <div className="space-y-2">
              <Accordion question="Can I retake the same exam multiple times?">
                Yes. There is no limit on retakes. Each attempt is saved
                separately to your history so you can track improvement over
                time.
              </Accordion>

              <Accordion question="What happens if I close the tab mid-exam?">
                Your solo exam progress is saved in your browser. When you
                return, the exam will resume where you left off — but the timer
                will have continued running. For room exams, progress is saved
                to the server so you can resume from any device.
              </Accordion>

              <Accordion question="Why did my timer not reset when I refreshed the room exam?">
                Room exam timers are anchored to the server. Your timer started
                the moment you tapped Start — refreshing only recalculates the
                remaining time from that fixed point, it doesn`t give you extra
                time.
              </Accordion>

              <Accordion question="My friend and I got different question orders — is that normal?">
                Yes, if the room has shuffle enabled. Each participant gets a
                uniquely randomised order that is fixed for their attempt. This
                is intentional to encourage independent work.
              </Accordion>

              <Accordion question="Can I see the leaderboard before I submit?">
                No. The leaderboard only becomes visible after you submit your
                attempt. This prevents you from seeing others` scores mid-exam.
              </Accordion>

              <Accordion question="I submitted but my score looks wrong — what happened?">
                Scoring happens server-side using the same question order and
                options you saw during the exam. Fill-in-the-blank answers with
                numerical tolerance are checked within the allowed range. If
                something looks off, use the question review on the results page
                to check each answer.
              </Accordion>

              <Accordion question="Can the host see my answers during the exam?">
                No. The host only sees participant status (joined, in progress,
                completed) and the final score after submission. Individual
                answers are private.
              </Accordion>

              <Accordion question="What does 'Close room' do exactly?">
                Closing a room prevents new participants from joining or
                starting the exam. Anyone already mid-exam can finish their
                attempt. After closing, the host can delete the room to remove
                all associated data permanently.
              </Accordion>

              <Accordion question="Can I join a room as both a participant and host?">
                Yes. As the host you can join your own room as a participant and
                take the exam yourself. Your score will appear on the
                leaderboard alongside everyone else`s.
              </Accordion>

              <Accordion question="Is my exam history private?">
                Yes. Only you can see your exam history, results, and analytics.
                Other students cannot view your scores unless you are in a
                shared room with the leaderboard enabled.
              </Accordion>
            </div>
          </Section>
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            For additional support, contact the{" "}
            <span className="font-semibold">CHEESA Tratech Committee</span>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
