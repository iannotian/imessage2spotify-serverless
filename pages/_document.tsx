import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="dark:bg-spotifyblack-800 dark:text-white bg-gray-100/75 font-light m-4 lg:mx-auto max-w-4xl">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
