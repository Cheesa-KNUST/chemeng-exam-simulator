import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseSlug = searchParams.get("courseSlug");

    const client = await clientPromise;
    const db = client.db(dbName);

    const query = courseSlug ? { courseSlug } : {};

    const exams = await db.collection("exams").find(query).toArray();

    return NextResponse.json(
      exams.map((e) => ({
        ...e,
        _id: undefined,
      })),
    );
  } catch (error) {
    console.error("[GET /api/exams]", error);
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, courseSlug, title, duration, difficulty, type, questions } =
      body;

    if (
      !id ||
      !courseSlug ||
      !title ||
      !duration ||
      !difficulty ||
      !type ||
      !questions
    ) {
      return NextResponse.json(
        {
          error:
            "id, courseSlug, title, duration, difficulty, type, and questions are required",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "questions must be a non-empty array" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const course = await db.collection("courses").findOne({ slug: courseSlug });
    if (!course) {
      return NextResponse.json(
        { error: `Course "${courseSlug}" does not exist` },
        { status: 404 },
      );
    }

    const existing = await db.collection("exams").findOne({ id });
    if (existing) {
      return NextResponse.json(
        { error: "An exam with this id already exists" },
        { status: 409 },
      );
    }

    const doc = {
      id,
      courseSlug,
      title,
      duration,
      difficulty,
      type,
      questions,
      createdAt: new Date(),
    };

    const result = await db.collection("exams").insertOne(doc);

    await db
      .collection("courses")
      .updateOne({ slug: courseSlug }, { $inc: { exams: 1 } });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[POST /api/exams]", error);
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 },
    );
  }
}
