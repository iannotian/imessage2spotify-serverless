import React from "react";
import cx from "classnames";
import { formatTimeAgo } from "~/lib/util";
import { PrismaTrack } from "~/lib/db";


function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export function Track({
  track,
  loading,
  onPressPlay,
  isPlaying,
  isCurrentTrack,
  isHovered,
  setHoveredTrack,
  index = 0,
  waveformData = [],
}: {
  track: PrismaTrack;
  loading?: "eager" | "lazy";
  onPressPlay: () => void;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  isHovered: boolean;
  setHoveredTrack: (track: PrismaTrack | null) => void;
  index?: number;
  waveformData?: number[];
}) {
  const staggerClass = `stagger-${(index % 12) + 1}`;

  return (
    <article
      className={cx(
        "track-card group relative opacity-0 animate-slide-up",
        staggerClass
      )}
      onMouseEnter={() => setHoveredTrack(track)}
      onMouseLeave={() => setHoveredTrack(null)}
      onTouchStart={() => setHoveredTrack(track)}
    >
      {/* Album Art Container */}
      <div className="relative aspect-square overflow-hidden bg-smoke">
        {/* The Album Image */}
        <img
          className={cx(
            "track-image w-full h-full object-cover",
            isPlaying && "scale-105"
          )}
          alt={`${track.album} by ${track.artist}`}
          src={track.imageUrl}
          loading={loading}
        />

        {/* Vinyl Record Effect - slides out on hover/play */}
        <div
          className={cx(
            "absolute top-1/2 -translate-y-1/2 w-[90%] aspect-square transition-all duration-500 ease-out pointer-events-none z-10",
            isHovered || isCurrentTrack
              ? "right-[-45%] opacity-100"
              : "right-[-100%] opacity-0"
          )}
        >
          <div
            className={cx(
              "w-full h-full rounded-full",
              "bg-[conic-gradient(from_0deg,#1a1a1a_0deg,#2a2a2a_30deg,#1a1a1a_60deg,#2a2a2a_90deg,#1a1a1a_120deg,#2a2a2a_150deg,#1a1a1a_180deg,#2a2a2a_210deg,#1a1a1a_240deg,#2a2a2a_270deg,#1a1a1a_300deg,#2a2a2a_330deg,#1a1a1a_360deg)]",
              "shadow-2xl",
              isCurrentTrack && "animate-spin-slow"
            )}
            style={
              isCurrentTrack
                ? { animationPlayState: isPlaying ? "running" : "paused" }
                : undefined
            }
          >
            {/* Center label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] aspect-square rounded-full bg-void flex items-center justify-center overflow-hidden">
              <img
                src={track.imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            {/* Center hole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8%] aspect-square rounded-full bg-void" />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div
          className={cx(
            "absolute inset-0 transition-opacity duration-300",
            "bg-gradient-to-t from-void via-void/50 to-transparent",
            isHovered || isCurrentTrack ? "opacity-90" : "opacity-0"
          )}
        />

        {/* Play/Pause Button */}
        {track.spotifyPreviewUrl && (
          <button
            onClick={onPressPlay}
            onFocus={() => setHoveredTrack(track)}
            onBlur={() => setHoveredTrack(null)}
            className={cx(
              "absolute bottom-4 left-4 z-20",
              "w-14 h-14 rounded-full",
              "flex items-center justify-center",
              "font-sans text-[10px] uppercase tracking-[0.05em] font-medium",
              "transition-all duration-300 ease-out",
              "focus:outline-none focus:ring-2 focus:ring-imessage-blue focus:ring-offset-2 focus:ring-offset-void",
              isPlaying
                ? "bg-imessage-blue text-white glow-pink scale-100 opacity-100"
                : isCurrentTrack
                  ? "bg-cream text-ash scale-100 opacity-100"
                  : isHovered
                    ? "bg-cream text-ash scale-100 opacity-100"
                    : "bg-cream/90 text-ash scale-90 opacity-0"
            )}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        )}

        {/* Spotify Link */}
        {track.spotifyUrl && (
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onFocus={() => setHoveredTrack(track)}
            onBlur={() => setHoveredTrack(null)}
            className={cx(
              "absolute bottom-4 right-4 z-20",
              "w-10 h-10 rounded-full",
              "flex items-center justify-center",
              "bg-acid-green text-void",
              "transition-all duration-300 ease-out",
              "hover:scale-110 hover:bg-neon-blue",
              "focus:outline-none focus:ring-2 focus:ring-acid-green focus:ring-offset-2 focus:ring-offset-void",
              isHovered || isCurrentTrack
                ? "scale-100 opacity-100"
                : "scale-90 opacity-0"
            )}
          >
            <SpotifyIcon className="w-5 h-5" />
          </a>
        )}

        {/* Now Playing Indicator with Waveform */}
        {isPlaying && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="flex items-end gap-[2px] h-4">
              {waveformData.map((value, i) => (
                <span
                  key={i}
                  className="w-[2px] bg-imessage-blue rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(15, value * 100)}%` }}
                />
              ))}
            </div>
            <span className="text-xs font-sans uppercase tracking-[0.15em] text-imessage-blue font-medium">
              Playing
            </span>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="mt-4 space-y-1">
        <h3 className="font-sans font-medium text-base leading-tight text-cream group-hover:text-imessage-blue transition-colors duration-300 line-clamp-1 tracking-tight">
          {track.title}
        </h3>
        <p className="font-sans text-sm text-silver font-light line-clamp-1">
          {track.artist}
        </p>
        <div className="flex items-center justify-between pt-1">
          <p className="font-serif italic text-sm text-silver/50 line-clamp-1 flex-1">
            {track.album}
          </p>
          {track.updatedAt && (
            <time
              dateTime={track.updatedAt.toString()}
              className="font-sans text-xs text-silver/60 ml-2 flex-shrink-0 font-light"
            >
              {formatTimeAgo(track.updatedAt.toString())}
            </time>
          )}
        </div>
      </div>

      {/* Decorative corner accent */}
      <div
        className={cx(
          "absolute top-0 right-0 w-8 h-8 transition-all duration-300",
          "border-t-2 border-r-2",
          isHovered || isCurrentTrack
            ? "border-imessage-blue"
            : "border-transparent"
        )}
      />
    </article>
  );
}
