import got, { OptionsOfJSONResponseBody } from "got";
import type { NextApiRequest, NextApiResponse } from "next";
import { FaunaTrack, getTrackById, saveTrack } from "../../../../lib/fauna";
import { refreshCache } from "../../../../lib/redis";
import { SpotifyTrack } from "../../../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token_type, access_token, uris } = req.body;
  const { playlist_id } = req.query;

  if (
    !token_type ||
    !access_token ||
    !Array.isArray(uris) ||
    uris.length > 1 ||
    !playlist_id
  ) {
    res.status(400).json({
      message: `Missing token_type (${token_type}), access_token (${access_token}), uris (${uris}), or playlist_id (${playlist_id}). Or uris is longer than 1.`,
    });
    return;
  }

  const reqConfig: OptionsOfJSONResponseBody = {
    method: "POST",
    url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
    json: {
      uris,
    },
    headers: {
      Authorization: `${token_type} ${access_token}`,
    },
    responseType: "json",
  };

  try {
    // save track to user's spotify playlist
    const response = await got(reqConfig).json();

    const uri = uris[0] as string;
    const trackId = uri.split(":").pop();

    if (!trackId) {
      res.status(400).json({ message: "trackId not found in uri" });
      return;
    }

    // handle upsert into db
    try {
      let track = await getTrackById(trackId);

      if (track) {
        await saveTrack(track);
      } else {
        // need more specific track details to save for first time
        const spotifyTrackResponse = await got({
          method: "GET",
          url: `https://api.spotify.com/v1/tracks/${trackId}`,
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
          responseType: "json",
        }).json<SpotifyTrack>();

        await saveTrack(
          FaunaTrack.translateFromSpotifyTrack(spotifyTrackResponse)
        );
      }

      if (process.env.NODE_ENV === "production") {
        await refreshCache();
      }

      res.status(200).end();
    } catch (error: any) {
      res.status(400).json({ faunaError: error });
    }
  } catch (error: any) {
    res.status(400).json({ spotifyResponseBody: error.response.body });
  }
}
