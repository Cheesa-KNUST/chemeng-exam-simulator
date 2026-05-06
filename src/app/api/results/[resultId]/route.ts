import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise, { dbName } from "@/lib/mongodb";

type Params = {
  params: Promise<{ resultId: string }>;
};

export async function GET(_req: Request, { params }: Params) {
  try {
    const { resultId } = await params;

    const id = Array.isArray(resultId) ? resultId[0] : resultId;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid result ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const result = await db
      .collection("examResults")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    const serialized = {
      ...JSON.parse(JSON.stringify(result)),
      _id: result._id.toString(),
      answers: Object.fromEntries(
        Object.entries(result.answers as Record<string, string>).map(
          ([k, v]) => [Number(k), v],
        ),
      ),
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("[GET /api/results/:resultId]", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 },
    );
  }
}
