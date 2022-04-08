import { SpotifyTrack } from "../../../lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { FaunaTrack, getTrackById, saveTrack } from "../../../lib/fauna";
import { refreshCache } from "../../../lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const spotifyTrack = req.body.track as SpotifyTrack;
    const dbTrack = await getTrackById(spotifyTrack.id);

    if (dbTrack) {
      await saveTrack(dbTrack);
    } else {
      await saveTrack(FaunaTrack.translateFromSpotifyTrack(spotifyTrack));
    }
    if (process.env.NODE_ENV === "production") {
      await refreshCache();
    }
  } catch (error) {
    res.status(400).send({ error });
  }
}
