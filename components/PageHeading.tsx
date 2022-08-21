export function PageHeading({ children }: { children: string }) {
  return (
    <div className="">
      <h1 className="text-gray-500 dark:text-gray-400 flex-shrink-0">
        <span className="block">iMessage2Spotify</span>
        <span className="block text-4xl">{children}</span>
      </h1>
    </div>
  );
}
