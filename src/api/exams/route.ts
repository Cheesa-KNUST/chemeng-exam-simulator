import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get("courseSlug");

  const client = await clientPromise;
  const db = client.db(dbName);

  const query = courseSlug ? { courseSlug } : {};

  const exams = await db.collection("exams").find(query).toArray();

  return NextResponse.json(exams);
}

export async function POST(req: Request) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db(dbName);

  const result = await db.collection("exams").insertOne(body);

  return NextResponse.json(result);
}
