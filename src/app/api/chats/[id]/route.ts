import { NextRequest, NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Params = Promise<{ id: string }>;

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;
  const client = await clientPromise;
  await client
    .db(dbName)
    .collection("chats")
    .deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const body = await req.json();
  const client = await clientPromise;

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (body.messages) patch.messages = body.messages;
  if (body.title !== undefined) patch.title = body.title;

  await client
    .db(dbName)
    .collection("chats")
    .updateOne({ _id: new ObjectId(id) }, { $set: patch });

  return NextResponse.json({ success: true });
}
