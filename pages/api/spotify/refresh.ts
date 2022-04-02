import got, { OptionsOfJSONResponseBody } from "got";
import type { NextApiRequest, NextApiResponse } from "next";
import { SPOTIFY_CLIENT_SECRET_BASE64 } from "../../../lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  if (!token) {
    res.status(400).json({ message: "No token received as query param" });
  }

  const reqConfig: OptionsOfJSONResponseBody = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "refresh_token",
      refresh_token: token,
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
