import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const courses = await db.collection("courses").find({}).toArray();

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

    const { slug, title, description } = body;

    if (!slug || !title || !description) {
      return NextResponse.json(
        { error: "slug, title, and description are required" },
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
      exams: body.exams ?? 0,
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
