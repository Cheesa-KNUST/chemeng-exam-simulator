import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db(dbName);

  const courses = await db.collection("courses").find({}).toArray();

  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db(dbName);

  const result = await db.collection("courses").insertOne(body);

  return NextResponse.json(result);
}
