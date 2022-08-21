import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/legacy/post")) {
    const apiKeyInRequest = request.headers.get("x-api-key");

    if (apiKeyInRequest === process.env.LEGACY_IMESSAGE2SPOTIFY_API_KEY) {
      return NextResponse.next();
    }

    return NextResponse.redirect("/404");
  }
}
