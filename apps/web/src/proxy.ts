import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("refresh_token")?.value;

  if (!token && request.nextUrl.pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/"],
};
