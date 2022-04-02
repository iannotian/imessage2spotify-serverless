import got, { OptionsOfJSONResponseBody } from "got";
import type { NextApiRequest, NextApiResponse } from "next";
import { SPOTIFY_CLIENT_SECRET_BASE64 } from "../../../lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, error } = req.query;

  if (error || !code) {
    res.status(403).end();
  }

  const reqConfig: OptionsOfJSONResponseBody = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "authorization_code",
      redirect_uri: process.env.SPOTIFY_CALLBACK_URI,
      code,
    },
    headers: {
      Authorization: `Basic ${SPOTIFY_CLIENT_SECRET_BASE64}`,
    },
    responseType: "json",
  };

  try {
    const body = await got(reqConfig).json();
    res.status(200).json(body);
  } catch (error: any) {
    res.status(400).end();
  }
}
