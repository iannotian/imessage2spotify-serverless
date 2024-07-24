import got, { OptionsOfJSONResponseBody } from "got";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  findTrackBySpotifyId,
  incrementOccurrencesForTrack,
  saveTrack,
} from "~/lib/db";
import { SpotifyTrack } from "~/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token_type, access_token, uris } = req.body;
  const playlist_id = req.query.playlist_id as string;

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

  const uri = uris[0] as `spotify:track:${string}`;
  const possibleShortenedLinkPath = uri.split(":").pop();

  // due to new spotify url format, need to check if uri is a shortened link
  // better solution would be to directly check if uri is a shortened link
  // but that involves shortcut changes and not something i want to do
  // spotify track ids are 22 characters long; skip if already true
  if (possibleShortenedLinkPath?.length !== 22) {
    // make request assuming it's a shortened link
    const spotifyLinkResponse = await got({
      method: "GET",
      url: `https://spotify.link/${possibleShortenedLinkPath}`,
    });

    // use regex to get find trackId from html
    const regex = /href="[^"]*track\/([a-zA-Z0-9]+)\?/gm;
    const match = regex.exec(spotifyLinkResponse.body);

    if (!match) {
      // if no match, then it's not a shortened link
      // and it's probably not a track id either
      // weird
      res.status(400).json({ message: "spotify link not found", uris });
      return;
    }

    // replace what was indeed a shortened link with full uri
    // mutating this is not ideal, but it's easy
    uris[0] = `spotify:track:${match[1]}`;
  }

  const addToPlaylistRequestConfig: OptionsOfJSONResponseBody = {
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
    const addToPlaylistResponse = await got(addToPlaylistRequestConfig).json();

    // remember uris[0] is possibly mutated above
    const uri = uris[0] as `spotify:track:${string}`;
    const trackId = uri.split(":").pop();

    if (!trackId) {
      res.status(400).json({ message: "trackId not found in uri" });
      return;
    }

    // handle upsert into db
    try {
      let track = await findTrackBySpotifyId(trackId);

      if (track) {
        await incrementOccurrencesForTrack(track);
      } else {
        // need more specific track details to save for first time
        const spotifyTrack = await got({
          method: "GET",
          url: `https://api.spotify.com/v1/tracks/${trackId}`,
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
          responseType: "json",
        }).json<SpotifyTrack>();

        await saveTrack(spotifyTrack);
      }

      res.status(200).end();
    } catch (error: any) {
      res
        .status(200)
        .json({
          message:
            "Encountered error saving to secondary database; this does not affect core functionality.",
          error,
        });
    }
  } catch (error: any) {
    res.status(400).json({ spotifyResponseBody: error.response.body });
  }
}
