import Head from "next/head";
import React from "react";
import cx from "classnames";
import { HotBadge } from "../components/HotBadge";
import { getAllTracks } from "../lib/fauna";
import { redis } from "../lib/redis";
import { formatTimeAgo } from "../lib/util";
import { CloseButton } from "../components/CloseButton";
import { Track } from "../components/Track";
import { PageHeading } from "../components/PageHeading";

const Home = ({ tracks }: { tracks: any[] }) => {
  const [showRoutineHubBanner, setShowRoutineHubBanner] = React.useState(true);

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

      <main className="space-y-8">
        <PageHeading>Latest Shared Tracks</PageHeading>
        <ul className="flex flex-col space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 md:sm:grid md:grid-cols-4 gap-x-4 gap-y-4">
          {tracks.map((track, index) => (
            <li key={track.spotify_track_id}>
              <Track track={track} loading={index <= 6 ? "eager" : "lazy"} />
            </li>
          ))}
        </ul>
      </main>
      <footer
        className={cx(
          "p-4 mb-4 flex items-center space-x-1 bg-white dark:bg-gray-600 fixed bottom-0 rounded-xl shadow-lg",
          { hidden: !showRoutineHubBanner }
        )}
      >
        <CloseButton onClick={() => setShowRoutineHubBanner(false)} />
        <p className="">
          Get the Apple Shortcut on{" "}
          <a
            className="font-bold text-blue-500"
            href="https://routinehub.co/shortcut/7741/"
            target="_blank"
            rel="noreferrer"
          >
            RoutineHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export async function getServerSideProps() {
  if (process.env.NODE_ENV === "production") {
    const cachedTracks = await redis.get<any>("tracks");

    if (cachedTracks) {
      return {
        props: { tracks: cachedTracks.reverse() },
      };
    }
  }

  const faunaTracks = await getAllTracks();
  const tracks = faunaTracks.data.map((track: any) => track.data);

  return { props: { tracks: tracks.reverse() } };
}

export default Home;
