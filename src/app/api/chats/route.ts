import { NextRequest, NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

  const client = await clientPromise;
  const chats = await client
    .db(dbName)
    .collection("chats")
    .find({ uid })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(chats);
}

export async function POST(req: NextRequest) {
  const { uid, messages } = await req.json();
  if (!uid || !messages?.length)
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const title =
    messages
      .find((m: { role: string }) => m.role === "user")
      ?.content?.slice(0, 60) ?? "Chat";

  const client = await clientPromise;
  const result = await client.db(dbName).collection("chats").insertOne({
    uid,
    title,
    messages,
    createdAt: new Date(),
  });

  return NextResponse.json({ id: result.insertedId });
}
