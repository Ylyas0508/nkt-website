import { NextRequest, NextResponse } from "next/server";
import { upsertCategoryOverride, deleteCustomCategory, getCategoryOverrides } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { CATEGORIES } from "@/lib/constants";

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

  // Custom category — actually delete
  const isBase = CATEGORIES.some((c) => c.id === id);
  if (!isBase) {
    const ok = await deleteCustomCategory(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  // Base category — mark as hidden via override
  await upsertCategoryOverride(id, { hidden: true });
  return NextResponse.json({ ok: true });
}
