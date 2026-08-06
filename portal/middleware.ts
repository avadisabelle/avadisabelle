import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyCeremonyToken } from "@/lib/ceremony";

// Guard the commons. Without a valid ceremony token, a visitor sees only the
// public threshold — everything under the (commons) route group is rewritten
// back to `/`. The matcher covers the commons' real URL paths.
export const config = {
  matcher: ["/commons/:path*"],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const ok = await verifyCeremonyToken(token);
  if (ok) return NextResponse.next();

  // No key offered → hold them at the threshold.
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("threshold", "closed");
  return NextResponse.rewrite(url);
}
