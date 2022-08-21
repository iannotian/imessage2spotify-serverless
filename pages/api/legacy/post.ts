import { SpotifyTrack } from "../../../lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { refreshCache } from "../../../lib/redis";
import { findTrackBySpotifyId, saveTrack } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const spotifyTrack = req.body.track as SpotifyTrack;
    saveTrack(spotifyTrack);

    if (process.env.NODE_ENV === "production") {
      await refreshCache();
    }
  } catch (error) {
    res.status(400).send({ error });
  }
}
