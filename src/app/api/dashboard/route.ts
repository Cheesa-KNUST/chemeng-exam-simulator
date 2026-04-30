import { NextResponse } from "next/server";
import { getDashboardData } from "@/helpers/dashboard/dashboard.db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const data = await getDashboardData(userId);

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", err },
      { status: 500 },
    );
  }
}
