import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, createBlogPost } from "@/lib/data";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(await getBlogPosts(), {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const post = await createBlogPost(data);
  return NextResponse.json(post, { status: 201 });
}
