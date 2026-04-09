import { NextRequest, NextResponse } from "next/server";
import { getContactMessages, createContactMessage } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const messages = await getContactMessages();
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.name || !data.email || !data.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const msg = await createContactMessage(data);
  return NextResponse.json(msg, { status: 201 });
}
