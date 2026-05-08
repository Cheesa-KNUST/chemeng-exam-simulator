"use client";

import Link from "next/link";
import {
  HelpCircle,
  BookOpen,
  Flag,
  Clock,
  MousePointerClick,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
      {icon}
      {title}
    </div>
  );
}

function Item({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="font-medium text-slate-700 dark:text-slate-200">{title}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
      {children}
    </section>
  );
}

export default function HelpPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <HelpCircle className="text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Help & Documentation
          </h1>
        </div>

        <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
          Learn how the ChemEng Exam Simulator works, how your performance is
          calculated, and how to navigate the platform efficiently.
        </p>

        <Card>
          <SectionTitle
            icon={<BarChart3 size={18} />}
            title="Dashboard Overview"
          />

          <Item title="Attempted Courses">
            The number of unique courses you have engaged with. Each course is
            counted once regardless of how many exams you take within it.
          </Item>

          <Item title="Completed Exams">
            The total number of exams you have completed. The weekly metric
            reflects exams taken within the current calendar week (Sunday to
            Saturday).
          </Item>

          <Item title="Average Score">
            The average of all your exam scores. Trends compare your recent
            performance against previous attempts to show improvement or decline
            over time (weekly average difference).
          </Item>

          <Item title="Performance Insights">
            Visual breakdown of your average score per course, helping you
            identify strong and weak subject areas.
          </Item>

          <Item title="Score Distribution">
            Shows how your scores are distributed across grade bands (A-F),
            giving a clear view of consistency.
          </Item>

          <Item title="Weekly Activity">
            Displays your exam activity grouped by calendar time periods,
            helping you track study consistency over time.
          </Item>

          <Item title="Trend Indicators">
            Arrows indicate performance movement: improvement (
            <ArrowUp size={10} className="inline-block align-middle" />
            ), decline (
            <ArrowDown size={10} className="inline-block align-middle" />
            ). If there is no meaningful change, no indicator is shown.
          </Item>
        </Card>

        <Card>
          <SectionTitle icon={<BookOpen size={18} />} title="Taking Exams" />

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Exams are multiple-choice and auto-save your responses as you
            progress. Once submitted or timed out, your results are stored
            automatically for analysis.
          </p>
        </Card>

        <Card>
          <SectionTitle
            icon={<MousePointerClick size={18} />}
            title="Navigation"
          />

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Move through questions using Next/Previous controls or the question
            sidebar. Your progress is saved in real time.
          </p>
        </Card>

        <Card>
          <SectionTitle icon={<Flag size={18} />} title="Flagging Questions" />

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Flag questions to revisit later. Flagged items are highlighted in
            the sidebar for quick reference during the exam.
          </p>
        </Card>

        <Card>
          <SectionTitle icon={<Clock size={18} />} title="Time Management" />

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Each exam is timed. If the timer reaches zero, your submission is
          </p>
        </Card>

        <div className="text-xs text-slate-400 dark:text-slate-500">
          For additional support, contact CHEESA Tratech Committee.
        </div>
      </div>

      <Link href="">
        <Button title="Share with us your experience" />
      </Link>
    </AppShell>
  );
}
