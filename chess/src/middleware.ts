import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // In a real app we could protect routes here. For now, noop.
  return NextResponse.next();
}

export const config = {
  matcher: ["/game/:path*", "/menu", "/friends", "/settings"],
};
