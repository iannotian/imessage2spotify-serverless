import { FaunaTrack } from "../lib/fauna";
import { formatTimeAgo } from "../lib/util";
import { HotBadge } from "./HotBadge";

export function Track({
  track,
  loading,
}: {
  track: FaunaTrack;
  loading?: "eager" | "lazy";
}) {
  return (
    <div className="flex sm:block space-x-4 sm:space-x-0 sm:space-y-4">
      <a className="flex-shrink-0" href={track.spotify_url}>
        <img
          className="transition-all duration-300 hover:scale-105 w-32 sm:w-full object-cover rounded-sm shadow-xl hover:shadow-2xl dark:shadow-none"
          alt={`Album cover art for ${track.artist}'s ${track.album}.`}
          src={track.image_url}
          loading={loading}
        />
      </a>
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
