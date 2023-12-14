import type { NextRequest, NextResponse } from "next/server";
import { findTracksAtCursor } from "~/lib/db";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "GET") {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const take = parseInt(searchParams.get("take") as string) ?? 10;

  const parsedDate = new Date(cursor as string);
  const isCursorValidDate = !isNaN(parsedDate.getTime());

  const date = isCursorValidDate ? parsedDate : new Date();

  const skip = isCursorValidDate ? 1 : 0;

  try {
    const { data, nextCursor } = await findTracksAtCursor(date, take, skip);

    return new Response(
      JSON.stringify({
        data,
        nextCursor,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
        date,
        take,
      }),
      { status: 500 }
    );
  }
}
