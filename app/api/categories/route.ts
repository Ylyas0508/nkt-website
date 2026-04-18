import { NextRequest, NextResponse } from "next/server";
import { getCategoryOverrides, createCustomCategory } from "@/lib/data";
import { CATEGORIES } from "@/lib/constants";
import { getSession } from "@/lib/auth";

export async function GET() {
  const overrides = await getCategoryOverrides();
  const overrideMap = new Map(overrides.map((o) => [o.id, o]));

  // Merge defaults with overrides, filtering hidden
  const merged = CATEGORIES.map((cat) => {
    const ov = overrideMap.get(cat.id);
    return ov ? { ...cat, ...ov } : cat;
  }).filter((cat) => !(cat as Record<string, unknown>).hidden);

  // Append visible custom categories
  const custom = overrides.filter((o) => o.isCustom && !o.hidden);
  return NextResponse.json([...merged, ...custom]);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const cat = await createCustomCategory(data);
  return NextResponse.json(cat, { status: 201 });
}
