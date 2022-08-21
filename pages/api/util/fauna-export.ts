import type { NextApiRequest, NextApiResponse } from "next";
import { getAllTracks } from "../../../lib/fauna";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const faunaTracks = await getAllTracks();
  const tracks = faunaTracks.data.map((track: any) => track.data);

  res.status(200).json(tracks);
}
