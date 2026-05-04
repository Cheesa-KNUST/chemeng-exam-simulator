import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const level = searchParams.get("level");
    const semester = searchParams.get("semester");

    const client = await clientPromise;
    const db = client.db(dbName);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (level) query.level = Number(level);
    if (semester) query.semester = Number(semester);

    const courses = await db.collection("courses").find(query).toArray();

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[GET /api/courses]", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { slug, title, description, level, semester } = body;

    if (!slug || !title || !description || !level || !semester) {
      return NextResponse.json(
        { error: "slug, title, description, level, and semester are required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const existing = await db.collection("courses").findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A course with this slug already exists" },
        { status: 409 },
      );
    }

    const doc = {
      slug,
      title,
      description,
      level: Number(level),
      semester: Number(semester),
      exams: 0,
      createdAt: new Date(),
    };

    const result = await db.collection("courses").insertOne(doc);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[POST /api/courses]", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
