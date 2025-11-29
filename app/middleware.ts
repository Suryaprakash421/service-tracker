// filepath: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Example: Check for a session cookie
  const token = request.cookies.get("session_token")?.value;

  // Define protected paths
  const isDashboardPath =
    request.nextUrl.pathname.startsWith("/app/dashboard") ||
    request.nextUrl.pathname.startsWith("/app/job") ||
    request.nextUrl.pathname.startsWith("/app/customer");

  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/dashboard/:path*", "/app/job/:path*", "/app/customer/:path*"],
};
