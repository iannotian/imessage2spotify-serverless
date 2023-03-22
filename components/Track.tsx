import React from "react";
import cx from "classnames";
import { formatTimeAgo } from "~/lib/util";
import { HotBadge } from "./HotBadge";
import {
  PlayIcon,
  PauseIcon,
  MusicNoteIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid";
import { PrismaTrack } from "~/lib/db";

export function Track({
  track,
  loading,
  onPressPlay,
  isPlaying,
  isHovered,
  setHoveredTrack,
}: {
  track: PrismaTrack;
  loading?: "eager" | "lazy";
  onPressPlay: Function;
  isPlaying: boolean;
  isHovered: boolean;
  setHoveredTrack: (track: PrismaTrack | null) => void;
}) {
  return (
    <div className="flex sm:block space-x-4 sm:space-x-0 sm:space-y-4">
      <div
        style={{ WebkitTouchCallout: "none" }}
        onTouchStart={() => setHoveredTrack(track)}
        onMouseEnter={() => setHoveredTrack(track)}
        onMouseLeave={() => setHoveredTrack(null)}
        onBlur={() => setHoveredTrack(null)}
        className="relative flex-shrink-0 self-start"
      >
        <img
          className={cx(
            "transition-all duration-100 w-32 sm:w-full object-cover rounded-sm hover:shadow-2xl dark:shadow-none",
            {
              "blur-sm shadow-xl scale-95": isHovered || isPlaying,
            }
          )}
          alt={`Album cover art for ${track.artist}'s ${track.album}.`}
          src={track.imageUrl}
          loading={loading}
        />
        <div
          className={cx(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden transition-all",
            {
              "opacity-0 scale-110 pointer-events-none":
                !isHovered && !isPlaying,
              "opacity-100 scale-100 pointer-events-auto":
                isHovered || isPlaying,
            }
          )}
        >
          <div className="flex flex-shrink-0 space-x-2 justify-around items-center h-full w-full bg-gray-500/80 shadow-inner p-2">
            {track.spotifyPreviewUrl && onPressPlay && (
              <button
                onClick={() => onPressPlay(track)}
                className="text-white p-4 rounded transition-colors hover:bg-slate-600 focus:bg-slate-600"
                onFocus={() => setHoveredTrack(track)}
                onBlur={() => setHoveredTrack(null)}
              >
                {isPlaying ? (
                  <PauseIcon className="text-white h-6 w-6" />
                ) : (
                  <PlayIcon className="text-white h-6 w-6" />
                )}
              </button>
            )}
            {track.spotifyUrl && (
              <a
                className="text-white p-4 rounded transition-colors hover:bg-slate-600 focus:bg-slate-600"
                href={track.spotifyUrl}
                onFocus={() => setHoveredTrack(track)}
                onBlur={() => setHoveredTrack(null)}
              >
                <ExternalLinkIcon className="text-white h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <p className="mb-[3px] text-xl leading-tight">{track.title}</p>
          <p className="text-sm font-semibold tracking-wide">{track.artist}</p>
          <p className="text-sm italic leading-tight">{track.album}</p>
          {track.updatedAt && (
            <time
              dateTime={track.updatedAt.toString()}
              className="text-gray-400 text-sm"
            >
              {formatTimeAgo(track.updatedAt.toString())}
            </time>
          )}
        </div>
      </div>
    </div>
  );
}
