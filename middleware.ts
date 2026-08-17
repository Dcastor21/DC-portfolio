import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host === "resume.dcastor.dev" && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/resume", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};