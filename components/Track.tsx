import React from "react";
import cx from "classnames";
import { FaunaTrack } from "../lib/fauna";
import { formatTimeAgo } from "../lib/util";
import { HotBadge } from "./HotBadge";
import { PlayIcon, ExternalLinkIcon } from "@heroicons/react/solid";

export function Track({
  track,
  loading,
  onPressPlay,
}: {
  track: FaunaTrack;
  loading?: "eager" | "lazy";
  onPressPlay?: Function;
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
              "blur-sm shadow-xl": showLocalControls,
            }
          )}
          alt={`Album cover art for ${track.artist}'s ${track.album}.`}
          src={track.image_url}
          loading={loading}
        />
        <div
          className={cx(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg overflow-hidden transition-all shadow-lg bg-gray-500",
            {
              "opacity-0 scale-95 pointer-events-none": !showLocalControls,
              "opacity-100 pointer-events-auto": showLocalControls,
            }
          )}
        >
          <div className="flex flex-shrink-0 justify-around items-center h-full w-full">
            {onPressPlay && (
              <button
                className="text-white p-4"
                onFocus={() => setShowLocalControls(true)}
                onBlur={() => setShowLocalControls(false)}
              >
                <PlayIcon className="text-white h-6 w-6" />
              </button>
            )}
            <a
              className="text-white p-4"
              href={track.spotify_url}
              onFocus={() => setShowLocalControls(true)}
              onBlur={() => setShowLocalControls(false)}
            >
              <ExternalLinkIcon className="text-white h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <HotBadge count={track.occurrences} />
        <div>
          <p className="">{track.title}</p>
          <p className="font-bold tracking-wide">{track.artist}</p>
          <p className="italic">{track.album}</p>
          {track.updated_at && (
            <time dateTime={track.updated_at} className="text-gray-400">
              {formatTimeAgo(track.updated_at)}
            </time>
          )}
        </div>
      </div>
    </div>
  );
}
