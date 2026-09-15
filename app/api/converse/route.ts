import { NextResponse } from "next/server";

// POST /api/presence/:slug/converse is the intended contract (see API.md).
// It is deliberately NOT implemented in v1. No model calls, no endpoints.
//
// The consent model (documented, not built):
//   - nothing is stored by default; memory is opt-in via consent.remember
//   - the memory belongs to the guest, and is revocable
//   - the presence's own room/voice is authoritative; the commons only routes
export function POST() {
  return NextResponse.json(
    {
      ok: false,
      status: "coming",
      message:
        "Conversation is not open yet. When it is, you'll speak with the presence directly — opt-in memory, guest-owned, revocable. See API.md.",
    },
    { status: 501 },
  );
}
