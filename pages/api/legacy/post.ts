import { SpotifyTrack } from "../../../lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { saveTrack } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const spotifyTrack = req.body.track as SpotifyTrack;
    saveTrack(spotifyTrack);
  } catch (error) {
    res.status(400).send({ error });
  }
}
