"use client";

import Link from "next/link";
import { useState } from "react";

import { exams } from "@/mock/exams";
import { courses } from "@/mock/courses";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof courses)[0] | null
  >(null);

  const courseExams = selectedCourse
    ? exams.filter((e) => e.courseSlug === selectedCourse.slug)
    : [];

  return (
    <AppShell>
      <PageHeader
        title="Courses"
        subtitle="Select a course to begin practicing exams"
      />

      <div className="mt-2 mb-6 max-h-[28vh] overflow-y-auto no-scrollbar">
        <div className="mt-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const isActive = course.slug === selectedCourse?.slug;

            return (
              <button
                key={course.slug}
                onClick={() => setSelectedCourse(course)}
                className={`
                  text-center group rounded-2xl p-5 transition border
                  ${
                    isActive
                      ? "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-900/20"
                      : "border-slate-800 bg-slate-900 hover:border-blue-500"
                  }
                `}
              >
                <h3
                  className={`"text-lg font-semibold transition" ${isActive ? "text-blue-400" : "text-white"}`}
                >
                  {course.title}
                </h3>

                <p className="text-sm text-slate-400 mt-2">
                  {course.description}
                </p>

                <div className="mt-4 text-xs text-slate-500">
                  {course.exams} {course.exams === 1 ? "Exam" : "Exams"}{" "}
                  available
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div className="h-px bg-slate-700 flex-1" />
      </div>

      <SectionTitle
        title="Available Exams"
        description="Look through and select the exams of your choice"
      />

      <div className="mt-2 mb-6 max-h-[40vh] overflow-y-auto no-scrollbar">
        {!selectedCourse ? (
          <div className="text-center py-16 border border-slate-800 rounded-2xl bg-slate-900">
            <p className="text-slate-400">
              Please select a course to view available exams
            </p>
          </div>
        ) : courseExams.length === 0 ? (
          <div className="text-center py-16 border border-slate-800 rounded-2xl bg-slate-900">
            <p className="text-slate-500 mt-6">
              No exams available for this course yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5 mt-6">
            {courseExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
              >
                <h3 className="text-lg font-semibold text-white">
                  {exam.title}
                </h3>

                <div className="mt-3 text-sm text-slate-400 space-y-1">
                  <p>Duration: {exam.duration} mins</p>
                  <p>Questions: {exam.questions.length}</p>
                  <p>Type: {exam.type}</p>
                  <p>Difficulty: {exam.difficulty}</p>
                </div>

                <div className="mt-5">
                  <Link href={`/student/exam/${exam.id}`}>
                    <Button variant="primary" fullWidth>
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
