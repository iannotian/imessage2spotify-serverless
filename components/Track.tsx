import React from "react";
import cx from "classnames";
import { FaunaTrack } from "../lib/fauna";
import { formatTimeAgo } from "../lib/util";
import { HotBadge } from "./HotBadge";
import {
  PlayIcon,
  PauseIcon,
  MusicNoteIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid";

export function Track({
  track,
  loading,
  onPressPlay,
  isPlaying,
}: {
  track: FaunaTrack;
  loading?: "eager" | "lazy";
  onPressPlay?: Function;
  isPlaying?: boolean;
}) {
  const [showLocalControls, setShowLocalControls] = React.useState(false);

  return (
    <div className="flex sm:block space-x-4 sm:space-x-0 sm:space-y-4">
      <div
        onMouseEnter={() => setShowLocalControls(true)}
        onMouseLeave={() => setShowLocalControls(false)}
        className="relative flex-shrink-0 self-start"
      >
        <img
          className={cx(
            "transition-all duration-300 w-32 sm:w-full object-cover rounded-sm hover:shadow-2xl dark:shadow-none",
            {
              "blur-sm shadow-xl scale-95": showLocalControls || isPlaying,
            }
          )}
          alt={`Album cover art for ${track.artist}'s ${track.album}.`}
          src={track.image_url}
          loading={loading}
        />
        <div
          className={cx(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden transition-all",
            {
              "opacity-0 scale-110 pointer-events-none":
                !showLocalControls && !isPlaying,
              "opacity-100 scale-100 pointer-events-auto":
                showLocalControls || isPlaying,
            }
          )}
        >
          <div className="flex flex-shrink-0 space-x-2 justify-around items-center h-full w-full bg-gray-500/80 shadow-inner p-2">
            {track.spotify_preview_url && onPressPlay && (
              <button
                onClick={() => onPressPlay(track)}
                className="text-white p-4 rounded transition-colors hover:bg-slate-600 focus:bg-slate-600"
                onFocus={() => setShowLocalControls(true)}
                onBlur={() => setShowLocalControls(false)}
              >
                {isPlaying ? (
                  <PauseIcon className="text-white h-6 w-6" />
                ) : (
                  <PlayIcon className="text-white h-6 w-6" />
                )}
              </button>
            )}
            {track.spotify_url && (
              <a
                className="text-white p-4 rounded transition-colors hover:bg-slate-600 focus:bg-slate-600"
                href={track.spotify_url}
                onFocus={() => setShowLocalControls(true)}
                onBlur={() => setShowLocalControls(false)}
              >
                <ExternalLinkIcon className="text-white h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex space-x-2">
          <HotBadge count={track.occurrences} />
          {track.spotify_preview_url && (
            <MusicNoteIcon className="flex-shrink-0 w-6 h-6" />
          )}
        </div>
        <div>
          <p className="mb-[3px] text-2xl leading-tight">{track.title}</p>
          <p className="font-bold tracking-wide">{track.artist}</p>
          <p className="italic">{track.album}</p>
          {track.updated_at && (
            <time dateTime={track.updated_at} className="text-gray-400 text-sm">
              {formatTimeAgo(track.updated_at)}
            </time>
          )}
        </div>
      </div>
    </div>
  );
}
