"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import { getCourses, getExamsByCourse } from "@/helpers/courses/course.service";
import { useAuth } from "@/context/AuthContext";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";

import {
  Clock,
  HelpCircle,
  Layers,
  Flame,
  BookOpen,
  ClipboardList,
} from "lucide-react";

type Course = {
  slug: string;
  title: string;
  description: string;
  exams: number;

  level: number;
  semester: number;
};

type Exam = {
  id: string;
  title: string;
  duration: number;
  questions: [];
  type: string;
  difficulty: string;
};

export default function CoursesPage() {
  const { profile } = useAuth();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);

  const [courseQuery, setCourseQuery] = useState("");
  const [examQuery, setExamQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getCourses(
          profile?.level ? Number(profile.level) : undefined,
          profile?.semester ? Number(profile.semester) : undefined,
        );
        if (!cancelled) setAllCourses(data);
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;

    let cancelled = false;

    (async () => {
      if (!cancelled) setLoadingExams(true);

      try {
        const data = await getExamsByCourse(selectedCourse.slug);
        if (!cancelled) setExams(data);
      } finally {
        if (!cancelled) setLoadingExams(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedCourse]);

  const filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(courseQuery.toLowerCase()),
  );

  const filteredExams = exams.filter((exam) =>
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
        {loadingCourses ? (
          <Loader label="Loading courses..." size="lg" />
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={22} />}
            title="No courses found"
            description={
              courseQuery
                ? "No courses match your search."
                : "No courses available."
            }
          />
        ) : (
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const isActive = course.slug === selectedCourse?.slug;

              return (
                <button
                  key={course.slug}
                  onClick={() => {
                    setSelectedCourse(course);
                    setExamQuery("");
                  }}
                  className={`text-left rounded-2xl p-5 border transition ${
                    isActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400"
                  }`}
                >
                  <h3 className="font-semibold">{course.title}</h3>

                  <p className="text-sm text-slate-500 mt-2">
                    {course.description}
                  </p>

                  <div className="mt-3 text-xs text-slate-400">
                    {course.exams} exams
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700 mb-6" />

      <SectionTitle
        title="Available Exams"
        description="Select an exam to begin"
      />

      {selectedCourse && (
        <Input
          placeholder="Search exams..."
          value={examQuery}
          onChange={(e) => setExamQuery(e.target.value)}
        />
      )}

      <div className="mt-4">
        {!selectedCourse ? (
          <EmptyState
            icon={<BookOpen size={22} />}
            title="No course selected"
            description="Select a course above"
          />
        ) : loadingExams ? (
          <Loader label="Loading exams..." size="lg" />
        ) : filteredExams.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={22} />}
            title="No exams found"
            description="Try another search"
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5"
              >
                <h3 className="font-semibold">{exam.title}</h3>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {exam.duration} mins
                  </div>

                  <div className="flex items-center gap-2">
                    <HelpCircle size={14} />
                    {exam.questions.length} questions
                  </div>

                  <div className="flex items-center gap-2">
                    <Layers size={14} />
                    {exam.type}
                  </div>

                  <div className="flex items-center gap-2">
                    <Flame size={14} />
                    {exam.difficulty}
                  </div>
                </div>

                <div className="mt-5">
                  <Link href={`/student/exam/${exam.id}`}>
                    <Button className="w-full">Start Exam</Button>
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
