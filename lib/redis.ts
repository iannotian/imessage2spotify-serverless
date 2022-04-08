import { Redis } from "@upstash/redis";
import { getAllTracks } from "./fauna";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

export async function refreshCache() {
  const faunaTracks = await getAllTracks();
  const tracks = faunaTracks.data.map((track: any) => track.data);

  redis.set("tracks", tracks);
}
