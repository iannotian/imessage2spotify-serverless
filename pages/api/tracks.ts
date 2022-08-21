import type { NextApiRequest, NextApiResponse } from "next";
import { findTracksAtCursor } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const parsedDate = new Date(req.query.cursor as string);
  const isCursorValidDate = !isNaN(parsedDate.getTime());

  const date = isCursorValidDate ? parsedDate : new Date();
  const take = parseInt(req.query.take as string) ?? 10;

  const skip = isCursorValidDate ? 1 : 0;

  try {
    const { data, nextCursor } = await findTracksAtCursor(date, take, skip);

    res.status(200).json({
      data,
      nextCursor,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message, date, take });
  }
}
