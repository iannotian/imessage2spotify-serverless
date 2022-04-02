import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const spotifyURL = new URL("https://accounts.spotify.com/authorize");

  const params = {
    client_id: process.env.SPOTIFY_CLIENT_ID ?? "",
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    scope: "playlist-modify-private playlist-modify-public",
  };

  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    spotifyURL.searchParams.append(key, value);
  });

  res.redirect(spotifyURL.href);
}
