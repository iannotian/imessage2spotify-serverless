import { ExternalLinkIcon } from "@heroicons/react/solid";
import React from "react";
import { CloseButton } from "./CloseButton";

export function RoutineHubBanner({
  onClickClose,
}: {
  onClickClose: () => void;
}) {
  return (
    <div className="flex space-x-2">
      <CloseButton onClick={() => onClickClose()} />
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
    </div>
  );
}
