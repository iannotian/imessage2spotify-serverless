import faunadb, { query as q } from "faunadb";
import { SpotifyTrack } from "./types";

enum FaunaIndex {
  SPOTIFY_TRACK_ID = "spotify_track_id_index",
}

enum FaunaCollection {
  TRACKS = "tracks",
}

export abstract class FaunaTrack {
  static translateFromSpotifyTrack(spotifyTrack: SpotifyTrack): {
    data: FaunaTrack;
    ref: null;
  } {
    const now = new Date().toISOString();

    return {
      ref: null,
      data: {
        spotify_track_id: spotifyTrack?.id,
        spotify_url: spotifyTrack?.uri,
        album: spotifyTrack?.album?.name,
        artist: spotifyTrack?.artists?.map((artist) => artist?.name).join(", "),
        image_url: spotifyTrack?.album?.images?.[0].url,
        occurrences: 1,
        title: spotifyTrack?.name,
        updated_at: now,
        created_at: now,
      },
    };
  }

  id?: number;
  spotify_track_id!: string;
  spotify_url!: string;
  title!: string;
  artist!: string;
  album!: string;
  image_url!: string;
  occurrences!: number;
  created_at?: string;
  updated_at?: string;
}

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_DB_SECRET ?? "",
});

export async function getAllTracks() {
  return await faunaClient.query<any>(
    q.Map(
      q.Paginate(q.Documents(q.Collection(FaunaCollection.TRACKS))),
      q.Lambda((track) => q.Get(track))
    )
  );
}

export async function getTrackById(id: string) {
  try {
    return await faunaClient.query<any>(
      q.Get(q.Match(q.Index(FaunaIndex.SPOTIFY_TRACK_ID), id))
    );
  } catch (error: any) {
    const notFound = error.requestResult.responseContent.errors
      .map((error: any) => error.code)
      .includes("instance not found");

    if (notFound) {
      return null;
    }

    throw error;
  }
}

export async function saveTrack(track: any) {
  const {
    data: { spotify_track_id },
  } = track;

  const now = new Date().toISOString();

  try {
    // update if exists
    return await faunaClient.query<any>(
      q.Update(
        q.Select(
          ["ref"],
          q.Get(q.Match(q.Index(FaunaIndex.SPOTIFY_TRACK_ID), spotify_track_id))
        ),
        {
          data: {
            ...track.data,
            occurrences: track.data.occurrences + 1,
            updated_at: now,
          },
        }
      )
    );
  } catch (error) {
    // else, create
    return await faunaClient.query<any>(
      q.Create(q.Collection(FaunaCollection.TRACKS), {
        ...track,
        occurrences: 1,
        updated_at: now,
        created_at: now,
      })
    );
  }
}
