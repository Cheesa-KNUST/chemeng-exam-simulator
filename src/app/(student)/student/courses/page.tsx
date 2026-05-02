"use client";

import Link from "next/link";
import { useState } from "react";

import { getCourses, getExamsByCourse } from "@/helpers/courses/course.service";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import {
  Clock,
  HelpCircle,
  Layers,
  Flame,
  BookOpen,
  ClipboardList,
} from "lucide-react";

export default function CoursesPage() {
  const allCourses = getCourses();
  const [courseQuery, setCourseQuery] = useState("");
  const [examQuery, setExamQuery] = useState("");

  const courses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(courseQuery.toLowerCase()),
  );

  const [selectedCourse, setSelectedCourse] = useState<
    (typeof courses)[0] | null
  >(null);

  const baseExams = selectedCourse ? getExamsByCourse(selectedCourse.slug) : [];

  const courseExams = baseExams.filter((exam) =>
    exam.title.toLowerCase().includes(examQuery.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader
        title="Courses"
        subtitle="Select a course to begin practicing exams"
      />

      <Input
        placeholder="Search courses..."
        value={courseQuery}
        onChange={(e) => setCourseQuery(e.target.value)}
      />

      <div className="mt-2 mb-6 max-h-[28vh] overflow-y-auto no-scrollbar">
        <div className="mt-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const isActive = course.slug === selectedCourse?.slug;

            return (
              <button
                key={course.slug}
                onClick={() => {
                  setSelectedCourse(course);
                  setExamQuery("");
                }}
                className={`text-left group rounded-2xl p-5 transition-all border ${
                  isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-md shadow-blue-200/60 dark:shadow-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm"
                }`}
              >
                <h3
                  className={`text-base font-semibold transition ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-800 dark:text-slate-100"
                  }`}
                >
                  {course.title}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="mt-4 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {course.exams} {course.exams === 1 ? "Exam" : "Exams"}{" "}
                  available
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700 mb-6" />

      <SectionTitle
        title="Available Exams"
        description="Look through and select the exams of your choice"
      />

      {selectedCourse && (
        <Input
          placeholder="Search exams..."
          value={examQuery}
          onChange={(e) => setExamQuery(e.target.value)}
        />
      )}

      <div className="mt-2 mb-6 max-h-[40vh] overflow-y-auto no-scrollbar">
        {!selectedCourse ? (
          <EmptyState
            icon={<BookOpen size={22} />}
            title="No course selected"
            description="Please select a course above to view available exams"
          />
        ) : courseExams.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={22} />}
            title="No exams yet"
            description="This course has no exams available at the moment"
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-5 mt-2">
            {courseExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-md dark:hover:shadow-slate-900/40 transition-shadow"
              >
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  {exam.title}
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock
                      size={14}
                      className="shrink-0 text-slate-400 dark:text-slate-500"
                    />
                    {exam.duration} {exam.duration === 1 ? "min" : "mins"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <HelpCircle
                      size={14}
                      className="shrink-0 text-slate-400 dark:text-slate-500"
                    />
                    {exam.questions.length}{" "}
                    {exam.questions.length === 1 ? "question" : "questions"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Layers
                      size={14}
                      className="shrink-0 text-slate-400 dark:text-slate-500"
                    />
                    {exam.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Flame
                      size={14}
                      className="shrink-0 text-slate-400 dark:text-slate-500"
                    />
                    {exam.difficulty}
                  </div>
                </div>

                <div className="mt-5">
                  <Link href={`/student/exam/${exam.id}`}>
                    <Button variant="primary" className="w-full justify-center">
                      Start Exam
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
