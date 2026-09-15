import { NextResponse } from "next/server";
import { getPresence } from "@/lib/presences";

// GET /api/presence/:slug — one presence's manifest.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const presence = getPresence(slug);
  if (!presence) {
    return NextResponse.json({ ok: false, message: "No such presence here." }, { status: 404 });
  }
  return NextResponse.json(presence);
}
