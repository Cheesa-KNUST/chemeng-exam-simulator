import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(dbName);

    const exam = await db.collection("exams").findOne({ id });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("[GET /api/exams/:id]", error);
    return NextResponse.json(
      { error: "Failed to fetch exam" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const body = await req.json();

    delete body.id;
    delete body._id;
    delete body.courseSlug;

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const result = await db
      .collection("exams")
      .findOneAndUpdate(
        { id },
        { $set: { ...body, updatedAt: new Date() } },
        { returnDocument: "after" },
      );

    if (!result) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PUT /api/exams/:id]", error);
    return NextResponse.json(
      { error: "Failed to update exam" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(dbName);

    const exam = await db.collection("exams").findOne({ id });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    await db.collection("exams").deleteOne({ id });

    await db
      .collection("courses")
      .updateOne({ slug: exam.courseSlug }, { $inc: { exams: -1 } });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[DELETE /api/exams/:id]", error);
    return NextResponse.json(
      { error: "Failed to delete exam" },
      { status: 500 },
    );
  }
}
