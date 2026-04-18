import { NextRequest, NextResponse } from "next/server";
import { getTeamMembers, createTeamMember } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  const members = await getTeamMembers();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const member = await createTeamMember(data);
  return NextResponse.json(member, { status: 201 });
}
