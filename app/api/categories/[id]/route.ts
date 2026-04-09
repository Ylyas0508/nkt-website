import { NextRequest, NextResponse } from "next/server";
import { upsertCategoryOverride, deleteCustomCategory } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  await upsertCategoryOverride(id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const ok = await deleteCustomCategory(id);
  if (!ok) return NextResponse.json({ error: "Not found or not deletable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
