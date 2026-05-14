import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const mongoDb = client.db();

    const [courses, exams] = await Promise.all([
      mongoDb.collection("courses").find({}).toArray(),
      mongoDb.collection("exams").find({}).toArray(),
    ]);

    const totalCourses = courses.length;
    const totalExams = exams.length;

    const examsByCourse = exams.reduce<Record<string, number>>((acc, e) => {
      const c = e.courseSlug ?? e.course ?? "Unknown";
      acc[c] = (acc[c] ?? 0) + 1;
      return acc;
    }, {});

    const topCourses = Object.entries(examsByCourse)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([course, count]) => ({ course, count }));

    return NextResponse.json({ totalCourses, totalExams, topCourses });
  } catch (err) {
    console.error("[dashboard/mongo]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
