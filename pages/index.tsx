import Head from "next/head";
import React from "react";
import cx from "classnames";
import { useAudioPlayer } from "react-use-audio-player";
import { FaunaTrack, getAllTracks } from "../lib/fauna";
import { redis } from "../lib/redis";
import { CloseButton } from "../components/CloseButton";
import { Track } from "../components/Track";
import { PageHeading } from "../components/PageHeading";
import { ExternalLinkIcon } from "@heroicons/react/solid";

const Home: React.FC<{ tracks: any[] }> = ({ tracks }) => {
  const [showRoutineHubBanner, setShowRoutineHubBanner] = React.useState(true);
  const [currentPlayingTrack, setCurrentPlayingTrack] =
    React.useState<FaunaTrack | null>(null);

  const { playing, play, pause } = useAudioPlayer({
    src: currentPlayingTrack?.spotify_preview_url,
    format: "mp3",
    autoplay: "false",
  });

  function handlePressPlay(track: FaunaTrack) {
    setCurrentPlayingTrack(track);

    if (
      playing &&
      track.spotify_preview_url === currentPlayingTrack?.spotify_preview_url
    ) {
      pause();
      return;
    }

    play();
  }

  return (
    <div className="max-w-4xl w-full">
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
              <Track
                track={track}
                loading={index <= 6 ? "eager" : "lazy"}
                onPressPlay={() => handlePressPlay(track)}
                isPlaying={
                  playing &&
                  track.spotify_preview_url ===
                    currentPlayingTrack?.spotify_preview_url
                }
              />
            </li>
          ))}
        </ul>
      </main>
      <footer
        className={cx(
          "p-4 mb-4 flex items-center space-x-2 bg-white dark:bg-gray-800 fixed bottom-0 rounded-xl shadow-lg",
          { hidden: !showRoutineHubBanner }
        )}
      >
        <CloseButton onClick={() => setShowRoutineHubBanner(false)} />
        <p>
          Get the iOS Shortcut on{" "}
          <a
            className="font-bold text-blue-500 dark:text-blue-400"
            href="https://routinehub.co/shortcut/7741/"
            target="_blank"
            rel="noreferrer"
          >
            RoutineHub
            <ExternalLinkIcon className="inline h-4 w-4 ml-[2px] mb-[3px]" />
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
