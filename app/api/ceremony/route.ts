import { NextResponse } from "next/server";
import { COOKIE_NAME, validateKey, signCeremonyToken } from "@/lib/ceremony";

// POST /api/ceremony  — offer a key at the threshold.
// Body: { key: string }. On success, set the signed ceremony cookie.
export async function POST(req: Request) {
  let key = "";
  try {
    const body = (await req.json()) as { key?: unknown };
    key = typeof body.key === "string" ? body.key : "";
  } catch {
    return NextResponse.json(
      { ok: false, message: "Offer a key at the threshold." },
      { status: 400 },
    );
  }

  if (!validateKey(key)) {
    // Gentle failure — a rite, not a login.
    return NextResponse.json(
      { ok: false, message: "The door doesn't open to that. Sit a moment; try again." },
      { status: 401 },
    );
  }

  const { token, maxAge } = await signCeremonyToken();
  const res = NextResponse.json({ ok: true, message: "Come in." });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}

// DELETE /api/ceremony — leave the room (clear the token).
export async function DELETE() {
  const res = NextResponse.json({ ok: true, message: "Go gently." });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
