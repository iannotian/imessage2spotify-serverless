import "~/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { AudioPlayerProvider } from "react-use-audio-player";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AudioPlayerProvider>
      <Component {...pageProps} />
    </AudioPlayerProvider>
  );
}

export default MyApp;
