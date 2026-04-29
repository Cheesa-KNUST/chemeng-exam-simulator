"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

import { courses } from "@/mock/courses";
import { exams } from "@/mock/exams";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const course = courses.find((c) => c.slug === slug);
  const courseExams = exams.filter((e) => e.courseSlug === slug);

  if (!course) {
    return (
      <AppShell>
        <div className="text-white">Course not found</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title={course.title} subtitle={course.description} />

      <SectionTitle
        title="Available Exams"
        description="Select an exam to begin your timed assessment"
      />

      <div className="grid md:grid-cols-2 gap-5 mt-6">
        {courseExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
          >
            <h3 className="text-lg font-semibold text-white">{exam.title}</h3>

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

      {courseExams.length === 0 && (
        <p className="text-slate-500 mt-6">
          No exams available for this course yet.
        </p>
      )}
    </AppShell>
  );
}
