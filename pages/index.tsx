import Head from "next/head";
import Image from "next/image";
import { HotBadge } from "../components/HotBadge";
import { getAllTracks } from "../lib/fauna";
import { redis } from "../lib/redis";
import { formatTimeAgo } from "../lib/util";

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

      <main className="space-y-4">
        <div>
          <h1 className="font-bold text-gray-400">
            IMESSAGE2SPOTIFY – LATEST SHARED TRACKS &nbsp;
          </h1>
          <a
            className=""
            href="https://routinehub.co/shortcut/7741/"
            target="_blank"
            rel="noreferrer"
          >
            Get the iOS Shortcut on RoutineHub
          </a>
        </div>
        <ul className="flex flex-col space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 md:sm:grid md:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-4">
          {tracks.reverse().map((track, index) => (
            <li
              key={track.spotify_track_id}
              className="flex sm:block space-x-4 sm:space-x-0 sm:space-y-2"
            >
              <a className="flex-shrink-0" href={track.spotify_url}>
                <img
                  className="w-32 sm:w-full object-cover"
                  alt={`Album cover art for ${track.artist}'s ${track.album}.`}
                  src={track.image_url}
                  loading={index <= 6 ? "eager" : "lazy"}
                />
              </a>
              <div className="">
                <HotBadge count={track.occurrences}></HotBadge>
                <p className="text-md">{track.title}</p>
                <p className="font-bold tracking-wide text-sm">
                  {track.artist}
                </p>
                <p className="italic text-sm">{track.album}</p>
                <time dateTime={track.updated_at} className="text-gray-400">
                  {formatTimeAgo(track.updated_at)}
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
