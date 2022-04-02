import got, { OptionsOfJSONResponseBody } from "got";
import type { NextApiRequest, NextApiResponse } from "next";
import { getTrackById, saveTrack } from "../../../../lib/fauna";
import { SpotifyTrack } from "../../../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token_type, access_token, uris } = req.body;
  const { playlist_id } = req.query;

  if (!token_type || !access_token || !Array.isArray(uris) || !playlist_id) {
    res.status(400).json({
      message: `Missing token_type (${token_type}), access_token (${access_token}), uris (${uris}), or playlist_id (${playlist_id})`,
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

    let track = await getTrackById(trackId);

    // handle upsert into db
    if (track) {
      await saveTrack(track);
    } else {
      const spotifyTrackResponse = await got({
        method: "GET",
        url: `https://api.spotify.com/v1/tracks/${trackId}`,
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
        responseType: "json",
      }).json<SpotifyTrack>();

      await saveTrack({
        spotify_track_id: spotifyTrackResponse?.id,
        spotify_url: spotifyTrackResponse?.uri,
        album: spotifyTrackResponse?.album?.name,
        artist: spotifyTrackResponse?.artists
          ?.map((artist) => artist?.name)
          .join(", "),
        image_url: spotifyTrackResponse?.album?.images?.[0].url,
        occurrences: 1,
        title: spotifyTrackResponse?.name,
      });
    }
  } catch (error: any) {
    res.status(400).json({ error });
  }
}
