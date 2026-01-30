import Head from "next/head";
import React from "react";
import { useAudioPlayer } from "react-use-audio-player";
import useSWRInfinite from "swr/infinite";
import { Track } from "~/components/Track";
import { PrismaTrack } from "~/lib/db";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useAudioAnalyser } from "~/lib/useAudioAnalyser";

type GetTracksResponse = { data: PrismaTrack[]; nextCursor: string };


function LoadingIndicator() {
  return (
    <div className="py-12 text-center">
      <span className="font-sans text-sm text-silver uppercase tracking-[0.15em] font-light">
        Loading...
      </span>
    </div>
  );
}

function DownloadCTA({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-smoke/95 backdrop-blur-sm border-t border-ash/50">
      <div className="px-6 md:px-8 lg:px-12 py-3">
        <div className="max-w-6xl mx-auto">
          {/* iMessage-style input pill */}
          <div className="bg-ash/60 rounded-full px-5 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-sans text-xs text-silver uppercase tracking-[0.15em] font-light">
              Shortcut
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://routinehub.co/shortcut/7741/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-cream hover:text-imessage-blue transition-colors font-light"
              >
                RoutineHub
              </a>
              <span className="text-ash">·</span>
              <a
                href="https://shareshortcuts.com/shortcuts/2317-imessage2spotify.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-cream hover:text-imessage-blue transition-colors font-light"
              >
                ShareShortcuts
              </a>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="font-sans text-xs text-silver hover:text-cream transition-colors font-light"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

const Home: React.FC = () => {
  const [showDownloadBanner, setShowDownloadBanner] = React.useState(true);
  const [currentPlayingTrack, setCurrentPlayingTrack] =
    React.useState<PrismaTrack | null>(null);

  const { playing, play, pause, load, ready } = useAudioPlayer({
    src: "",
    format: "mp3",
    autoplay: false,
  });

  // Load and play when track changes
  const prevTrackRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    const url = currentPlayingTrack?.spotifyPreviewUrl;
    if (url && url !== prevTrackRef.current) {
      prevTrackRef.current = url;
      load({ src: url, format: "mp3", autoplay: true });
    }
  }, [currentPlayingTrack?.spotifyPreviewUrl, load]);

  const waveformData = useAudioAnalyser(playing);

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    return await response.json();
  };

  const getKey = (pageIndex: number, previousPageData: GetTracksResponse) => {
    if (previousPageData && !previousPageData.data) return null;
    if (pageIndex === 0) return `/api/tracks?cursor=null&take=12`;
    return `/api/tracks?cursor=${previousPageData.nextCursor}&take=12`;
  };

  const { data, size, setSize, isValidating } =
    useSWRInfinite<GetTracksResponse>(getKey, fetcher);

  useBottomScrollListener(
    () => {
      if (!isValidating) setSize(size + 1);
    },
    {
      debounce: 1000,
      triggerOnNoScroll: false,
    }
  );

  const [hoveredTrack, setHoveredTrack] = React.useState<PrismaTrack | null>(
    null
  );

  function handlePressPlay(track: PrismaTrack) {
    const isSameTrack =
      track.spotifyPreviewUrl === currentPlayingTrack?.spotifyPreviewUrl;

    if (isSameTrack) {
      // Toggle play/pause for same track
      if (playing) {
        pause();
      } else {
        play();
      }
      return;
    }

    // New track - load will trigger via useEffect with autoplay
    setCurrentPlayingTrack(track);
  }

  const tracks = data?.flatMap((page) => page?.data || []) || [];

  return (
    <div className="min-h-screen">
      <Head>
        <title>iMessage2Spotify — Music Shared With Love</title>
        <meta
          name="description"
          content="Discover tracks shared between friends via iMessage. A living feed of music recommendations."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="px-6 md:px-8 lg:px-12 pt-8 pb-6">
        <div className="max-w-6xl mx-auto flex items-baseline justify-between gap-4">
          <h1 className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="bg-imessage-blue text-white font-sans text-xs uppercase tracking-[0.15em] font-medium px-3 py-1.5 rounded-2xl rounded-bl-sm">
                iMessage
              </span>
              <span className="font-sans text-xs text-white font-bold">
                2
              </span>
            </div>
            <div className="flex justify-end">
              <span className="bg-sms-green text-white font-sans text-xs uppercase tracking-[0.15em] font-medium px-3 py-1.5 rounded-2xl rounded-br-sm">
                Spotify
              </span>
            </div>
          </h1>
          <span className="font-sans text-xs text-silver/70 hidden sm:block">
            Shared via iMessage
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Track Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {tracks.length > 0 &&
              tracks.map((track, index) => (
                <Track
                  key={track.spotifyTrackId}
                  track={track}
                  loading={index <= 6 ? "eager" : "lazy"}
                  onPressPlay={() => handlePressPlay(track)}
                  isPlaying={
                    playing &&
                    track.spotifyPreviewUrl ===
                      currentPlayingTrack?.spotifyPreviewUrl
                  }
                  isCurrentTrack={
                    track.spotifyPreviewUrl ===
                    currentPlayingTrack?.spotifyPreviewUrl
                  }
                  isHovered={hoveredTrack?.id === track?.id}
                  setHoveredTrack={setHoveredTrack}
                  index={index}
                  waveformData={
                    track.spotifyPreviewUrl ===
                    currentPlayingTrack?.spotifyPreviewUrl
                      ? waveformData
                      : undefined
                  }
                />
              ))}
          </div>

          {/* Loading State */}
          {isValidating && <LoadingIndicator />}

          {/* Empty State */}
          {!isValidating && tracks.length === 0 && (
            <div className="py-24">
              <p className="font-sans text-sm text-silver uppercase tracking-[0.15em] font-light">
                No tracks yet
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-8 lg:px-12 mb-24">
        <div className="max-w-6xl mx-auto">
          <span className="font-sans text-xs text-silver/70 uppercase tracking-[0.15em]">
            Live
          </span>
        </div>
      </footer>

      {/* Download CTA */}
      {showDownloadBanner && (
        <DownloadCTA onDismiss={() => setShowDownloadBanner(false)} />
      )}
    </div>
  );
};

export default Home;
