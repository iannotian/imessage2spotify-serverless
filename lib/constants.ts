export const SPOTIFY_CLIENT_SECRET_BASE64 = Buffer.from(
  `${process.env.CLIENT_ID}:${
    process.env.CLIENT_SECRET
  }`
).toString("base64");