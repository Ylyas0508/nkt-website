import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const product = await createProduct(data);
  return NextResponse.json(product, { status: 201 });
}
