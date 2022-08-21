import { PrismaClient } from "@prisma/client";
import { SpotifyTrack } from "./types";

const prisma = new PrismaClient();

export const findAllTracks = async () => {
  return await prisma.track.findMany();
};

export const findTrackBySpotifyId = async (spotifyTrackId: string) => {
  return await prisma.track.findUnique({
    where: {
      spotifyTrackId,
    },
  });
};

export const saveTrack = async (track: SpotifyTrack) => {
  const { id } = track;

  const existingTrack = await findTrackBySpotifyId(id);

  if (existingTrack) {
    return await prisma.track.update({
      where: {
        id: existingTrack.id,
      },
      data: {
        occurrences: existingTrack.occurrences + 1,
      },
    });
  } else {
    return await prisma.track.create({
      data: {
        title: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        imageUrl: track.album.images[0].url,
        spotifyTrackId: track.id,
        spotifyUrl: track.uri,
        spotifyPreviewUrl: track.preview_url,
      },
    });
  }
};
