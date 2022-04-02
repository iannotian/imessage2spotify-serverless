import Head from "next/head";
import Image from "next/image";
import { getAllTracks } from "../lib/fauna";
import { Redis } from "@upstash/redis";
import { redis } from "../lib/redis";

const Home = ({ tracks }: { tracks: any[] }) => {
  return (
    <div>
      <Head>
        <title>iMessage2Spotify</title>
        <meta
          name="description"
          content="Latest tracks shared by iMessage2Spotify users"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          IMESSAGE2SPOTIFY – LATEST SHARED TRACKS &nbsp;{" "}
          <a className="badge" href="https://routinehub.co/shortcut/7741/">
            <span>Get the iOS Shortcut on RoutineHub</span>
          </a>
        </h1>
        <ul className="track-list">
          {tracks.map((track, index) => (
            <li key={track.spotify_track_id} className="track-list-item">
              <a href={track.spotify_url}>
                <div className="track-image">
                  <Image
                    alt={`Album cover art for ${track.artist}'s ${track.album}.`}
                    src={track.image_url}
                    height={"256px"}
                    width={"256px"}
                    priority={index <= 6}
                  />
                </div>
              </a>
              <div className="track-details">
                <p className="track-title">
                  {track.title}
                  <span className="track-occurrences">{track.occurrences}</span>
                </p>
                <p className="track-artist">{track.artist}</p>
                <p className="track-album">{track.album}</p>
                <time
                  dateTime={track.updated_at}
                  className="track-share-details"
                >
                  {track.updated_at}
                </time>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  if (process.env.NODE_ENV === "production") {
    const cachedTracks = await redis.get<any>("tracks");

    if (cachedTracks) {
      return {
        props: { tracks: cachedTracks },
      };
    }
  }

  const faunaTracks = await getAllTracks();
  const tracks = faunaTracks.data.map((track: any) => track.data);

  return { props: { tracks } };
}

export default Home;
