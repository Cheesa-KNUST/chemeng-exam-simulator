import { NextRequest, NextResponse } from "next/server";

import { joinRoomSchema } from "@/helpers/rooms/room.validation";
import { joinRoom, RoomError } from "@/helpers/rooms/room.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = joinRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { room, participant } = await joinRoom(parsed.data);

    return NextResponse.json({ room, participant }, { status: 200 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("ROOM_JOIN_ERROR:", error);

    return NextResponse.json({ error: "Failed to join room" }, { status: 500 });
  }
}
