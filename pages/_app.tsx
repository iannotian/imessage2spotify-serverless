import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import Router from "next/router";
import { PageSpinner } from "../components/PageSpinner";

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("findished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return <>{loading ? <PageSpinner /> : <Component {...pageProps} />}</>;
}

export default MyApp;
