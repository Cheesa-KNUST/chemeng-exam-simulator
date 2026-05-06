import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      examId,
      course,
      score,
      correct,
      total,
      answers,
      questions,
    } = body;

    if (
      !userId ||
      !examId ||
      !course ||
      score === undefined ||
      correct === undefined ||
      !total ||
      !answers ||
      !questions
    ) {
      return NextResponse.json(
        {
          error:
            "userId, examId, course, score, correct, total, answers, and questions are required",
        },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const doc = {
      userId,
      examId,
      course,
      score,
      correct,
      total,
      answers,
      questions,
      createdAt: new Date(),
    };

    const result = await db.collection("examResults").insertOne(doc);
    const resultId = result.insertedId.toHexString();

    console.log("[POST /api/results] saved, resultId:", resultId);

    return NextResponse.json({ resultId }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/results]", error);
    return NextResponse.json(
      { error: "Failed to save exam result" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query param is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const result = await db.collection("examResults").deleteMany({ userId });

    return NextResponse.json({ deleted: result.deletedCount });
  } catch (error) {
    console.error("[DELETE /api/results]", error);
    return NextResponse.json(
      { error: "Failed to delete results" },
      { status: 500 },
    );
  }
}
