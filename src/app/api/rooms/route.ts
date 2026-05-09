import { NextRequest, NextResponse } from "next/server";

import {
  createRoom,
  getRoomsForUser,
  RoomError,
} from "@/helpers/rooms/room.service";
import { createRoomSchema } from "@/helpers/rooms/room.validation";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const rooms = await getRoomsForUser(userId);

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("ROOMS_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = createRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid room data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const room = await createRoom(parsed.data, body.creatorId);

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("ROOM_CREATE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}
