import { NextRequest, NextResponse } from "next/server";

import {
  startAttempt,
  submitAttempt,
  getAttempt,
  RoomError,
} from "@/helpers/rooms/room.service";

type Params = { params: Promise<{ code: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { code } = await params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const attempt = await startAttempt(code.toUpperCase(), userId);

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("ATTEMPT_START_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to start attempt" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { code } = await params;
    const { userId, answers } = await req.json();

    if (!userId || !answers) {
      return NextResponse.json(
        { error: "userId and answers are required" },
        { status: 400 },
      );
    }

    const attempt = await submitAttempt(code.toUpperCase(), userId, answers);

    return NextResponse.json(attempt, { status: 200 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("ATTEMPT_SUBMIT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to submit attempt" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { code } = await params;
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const attempt = await getAttempt(code.toUpperCase(), userId);

    return NextResponse.json(attempt, { status: 200 });
  } catch (error) {
    if (error instanceof RoomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("ATTEMPT_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch attempt" },
      { status: 500 },
    );
  }
}
