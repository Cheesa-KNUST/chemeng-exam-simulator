import { NextRequest, NextResponse } from "next/server";

import {
  getRoomWithParticipants,
  closeRoom,
  RoomError,
  deleteRoom,
} from "@/helpers/rooms/room.service";

type Params = { params: Promise<{ code: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { code } = await params;

    const data = await getRoomWithParticipants(code.toUpperCase());

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("ROOM_GET_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { code } = await params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    await closeRoom(code.toUpperCase(), userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("ROOM_CLOSE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to close room" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { code } = await params;
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    await deleteRoom(code.toUpperCase(), userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("Room_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 },
    );
  }
}
