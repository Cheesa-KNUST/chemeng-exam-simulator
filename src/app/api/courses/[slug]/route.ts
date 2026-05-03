import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

type Params = { params: { slug: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = params;

    const client = await clientPromise;
    const db = client.db(dbName);

    const course = await db.collection("courses").findOne({ slug });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("[GET /api/courses/:slug]", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { slug } = params;
    const body = await req.json();

    delete body.slug;
    delete body._id;

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const result = await db
      .collection("courses")
      .findOneAndUpdate(
        { slug },
        { $set: { ...body, updatedAt: new Date() } },
        { returnDocument: "after" },
      );

    if (!result) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PUT /api/courses/:slug]", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { slug } = params;

    const client = await clientPromise;
    const db = client.db(dbName);

    const result = await db.collection("courses").deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("[DELETE /api/courses/:slug]", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
