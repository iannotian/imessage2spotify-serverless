import { PrismaClient, Prisma, Track } from "@prisma/client";
import { SpotifyTrack } from "./types";

export type PrismaTrack = Prisma.TrackGetPayload<{}>;

const prisma = new PrismaClient();

export const findAllTracks = async () => {
  return await prisma.track.findMany({ orderBy: { updatedAt: "desc" } });
};

export const findTrackBySpotifyId = async (spotifyTrackId: string) => {
  return await prisma.track.findUnique({
    where: {
      spotifyTrackId,
    },
  });
};

export const incrementOccurrencesForTrack = async (existingTrack: Track) => {
  return await prisma.track.update({
    where: {
      id: existingTrack.id,
    },
    data: {
      occurrences: existingTrack.occurrences + 1,
    },
  });
};

export const saveTrack = async (spotifyTrack: SpotifyTrack) => {
  const { id } = spotifyTrack;

  const existingTrack = await findTrackBySpotifyId(id);

  if (existingTrack) {
    return incrementOccurrencesForTrack(existingTrack);
  } else {
    return await prisma.track.create({
      data: {
        title: spotifyTrack.name,
        artist: spotifyTrack.artists.map((artist) => artist.name).join(", "),
        album: spotifyTrack.album.name,
        imageUrl: spotifyTrack.album.images[0].url,
        spotifyTrackId: spotifyTrack.id,
        spotifyUrl: spotifyTrack.uri,
        spotifyPreviewUrl: spotifyTrack.preview_url,
      },
    });
  }
};
