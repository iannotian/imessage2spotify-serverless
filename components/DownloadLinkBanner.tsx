import { ExternalLinkIcon } from "@heroicons/react/solid";
import React from "react";
import { CloseButton } from "./CloseButton";

function ExternalLink({ name, href }: { name: string; href: string }) {
  return (
    <a
      className="font-bold text-blue-500 dark:text-blue-400"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {name}
      <ExternalLinkIcon className="inline h-4 w-4 ml-[2px] mb-[3px]" />
    </a>
  );
}

export function DownloadLinkBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="flex space-x-2">
      <CloseButton onClick={() => onDismiss()} />
      <p>
        Get the iOS Shortcut on{" "}
        <ExternalLink
          name="RoutineHub"
          href="https://routinehub.co/shortcut/7741/"
        />{" "}
        or{" "}
        <ExternalLink
          name="ShareShortcuts"
          href="https://shareshortcuts.com/shortcuts/2317-imessage2spotify.html"
        />
      </p>
    </div>
  );
}
