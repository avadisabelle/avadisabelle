import { NextResponse } from "next/server";
import { listPresences } from "@/lib/presences";

// GET /api/presence — list the presences from the commons' allowlist.
export function GET() {
  return NextResponse.json({ presences: listPresences(), canonical: false });
}
