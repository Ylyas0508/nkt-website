import { NextRequest, NextResponse } from "next/server";
import { getCertificates, createCertificate } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  const certs = await getCertificates();
  return NextResponse.json(certs);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const cert = await createCertificate(data);
  return NextResponse.json(cert, { status: 201 });
}
