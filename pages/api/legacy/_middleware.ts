import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const apiKeyInRequest = request.headers.get("x-api-key");

  if (apiKeyInRequest === process.env.LEGACY_IMESSAGE2SPOTIFY_API_KEY) {
    return NextResponse.next();
  }

  return new Response("Forbidden", {
    status: 403,
  });
}
