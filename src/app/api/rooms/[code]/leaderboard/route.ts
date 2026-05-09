import { NextRequest, NextResponse } from "next/server";

import { getLeaderboard } from "@/helpers/rooms/room.service";
import { RoomError } from "@/helpers/rooms/room.service";

type Params = { params: Promise<{ code: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { code } = await params;
    const userId = req.nextUrl.searchParams.get("userId");

    const leaderboard = await getLeaderboard(
      code.toUpperCase(),
      userId ?? undefined,
    );

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("LEADERBOARD_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
