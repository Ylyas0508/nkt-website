import { NextRequest, NextResponse } from "next/server";
import { getAboutStats, updateAboutStats } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  const stats = await getAboutStats();
  return NextResponse.json(stats);
}

export async function PUT(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const updated = await updateAboutStats(data);
  return NextResponse.json(updated);
}
