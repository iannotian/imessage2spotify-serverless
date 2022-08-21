import Head from "next/head";
import React from "react";
import cx from "classnames";
import { useAudioPlayer } from "react-use-audio-player";
import useSWRInfinite from "swr/infinite";
import { Track } from "../components/Track";
import { PageHeading } from "../components/PageHeading";
import { RoutineHubBanner } from "../components/RoutineHubBanner";
import { findTracksAtCursor, PrismaTrack } from "../lib/db";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

type GetTracksResponse = { data: PrismaTrack[]; nextCursor: string };

const Home: React.FC<{ fallback: GetTracksResponse }> = ({ fallback }) => {
  const [showRoutineHubBanner, setShowRoutineHubBanner] = React.useState(true);
  const [currentPlayingTrack, setCurrentPlayingTrack] =
    React.useState<PrismaTrack | null>(null);

  const { playing, play, pause } = useAudioPlayer({
    src: currentPlayingTrack?.spotifyPreviewUrl,
    format: "mp3",
    autoplay: "false",
  });

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    return await response.json();
  };

  const getKey = (pageIndex: number, previousPageData: GetTracksResponse) => {
    // reached the end
    if (previousPageData && !previousPageData.data) return null;

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/tracks?cursor=null&take=12`;

    // add the cursor to the API endpoint
    return `/api/tracks?cursor=${previousPageData.nextCursor}&take=12`;
  };

  const { data, size, setSize } = useSWRInfinite<GetTracksResponse>(
    getKey,
    fetcher,
    { fallback }
  );

  useBottomScrollListener(() => setSize(size + 1), {
    debounce: 1000,
    triggerOnNoScroll: false,
  });

  const [hoveredTrack, setHoveredTrack] = React.useState<PrismaTrack | null>(
    null
  );

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

  const tracks = data?.flatMap((page) => page?.data || []) || [];

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
          {tracks.length > 0 &&
            tracks.map((track, index) => (
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
                  isHovered={hoveredTrack?.id === track?.id}
                  setHoveredTrack={setHoveredTrack}
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
  return {
    props: {
      fallback: JSON.parse(
        JSON.stringify(await findTracksAtCursor(new Date(), 12, 0))
      ),
    },
  };
}

export default Home;
