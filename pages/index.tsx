import Head from "next/head";
import React from "react";
import cx from "classnames";
import { useAudioPlayer } from "react-use-audio-player";
import { redis } from "../lib/redis";
import { Track } from "../components/Track";
import { PageHeading } from "../components/PageHeading";
import { RoutineHubBanner } from "../components/RoutineHubBanner";
import { findAllTracks, PrismaTrack } from "../lib/db";

const Home: React.FC<{ tracks: PrismaTrack[] }> = ({ tracks }) => {
  const [showRoutineHubBanner, setShowRoutineHubBanner] = React.useState(true);
  const [currentPlayingTrack, setCurrentPlayingTrack] =
    React.useState<PrismaTrack | null>(null);

  const { playing, play, pause } = useAudioPlayer({
    src: currentPlayingTrack?.spotifyPreviewUrl,
    format: "mp3",
    autoplay: "false",
  });

  function handlePressPlay(track: PrismaTrack) {
    setCurrentPlayingTrack(track);

    if (
      playing &&
      track.spotifyPreviewUrl === currentPlayingTrack?.spotifyPreviewUrl
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
        <ul className="grid grid-cols-1 sm:grid-cols-3 md:sm:grid md:grid-cols-4 gap-x-4 sm:gap-y-12 gap-y-4">
          {tracks.map((track, index) => (
            <li key={track.spotifyTrackId}>
              <Track
                track={track}
                loading={index <= 6 ? "eager" : "lazy"}
                onPressPlay={() => handlePressPlay(track)}
                isPlaying={
                  playing &&
                  track.spotifyPreviewUrl ===
                    currentPlayingTrack?.spotifyPreviewUrl
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
        <RoutineHubBanner onClickClose={() => setShowRoutineHubBanner(false)} />
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

  const tracks = await findAllTracks();

  return { props: { tracks: JSON.parse(JSON.stringify(tracks)) } };
}

export default Home;
