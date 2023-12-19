import got, { OptionsOfJSONResponseBody } from "got";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import cx from "classnames";
import React from "react";
import { PageHeading } from "~/components/PageHeading";

export const runtime = "edge";

const Callback = ({
  data,
  message,
  error,
}: {
  data: any;
  message: string;
  error: any;
}) => {
  const [copyStatus, setCopyStatus] = React.useState({
    success: false,
    error: false,
  });

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ success: true, error: false });
    } catch (error) {
      setCopyStatus({ success: false, error: true });
    }
  }

  return (
    <div>
      <Head>
        <title>iMessage2Spotify - Spotify Token Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        <PageHeading>Spotify Token Setup</PageHeading>
        <div className="space-y-4">
          <div
            className={cx("space-y-2 p-4 rounded-lg inline-block max-w-2xl", {
              "bg-red-200 text-red-700": error,
              "bg-green-200 text-green-700": !error,
            })}
          >
            <p>{message}</p>
            {error && <p>Error: {error}</p>}
          </div>
          {data && (
            <div className="space-y-4">
              <button
                className={cx("rounded-lg text-white px-3 py-2", {
                  "bg-red-500": copyStatus.error,
                  "bg-green-500": copyStatus.success,
                  "bg-blue-500": !copyStatus.success && !copyStatus.error,
                })}
                onClick={() => copyToClipboard(JSON.stringify(data))}
              >
                {copyStatus.error
                  ? "Failed copy. Try again?"
                  : copyStatus.success
                  ? "Copied!"
                  : "Copy to Clipboard"}
              </button>
              <textarea
                className="block font-mono w-full h-[50vh] rounded-lg dark:bg-gray-800"
                contentEditable={false}
                readOnly={true}
                id="token-data"
                value={JSON.stringify(data, undefined, 2)}
              ></textarea>
            </div>
          )}
          {error && (
            <div>
              <Link href="/api/spotify/authorize" passHref>
                <a className="inline-block py-2 px-3 bg-gray-600 text-white rounded-lg">
                  Try again?
                </a>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { code, error } = query;

  if (error || !code) {
    return {
      props: {
        data: null,
        message:
          "There was an issue with authorization. Try logging out of Spotify in Safari if this persists.",
        error: error ?? "Missing Spotify code in query parameter.",
      },
    };
  }

  const reqConfig: OptionsOfJSONResponseBody = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "authorization_code",
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      code,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    },
    responseType: "json",
  };

  try {
    const data = await got(reqConfig).json();

    return {
      props: {
        data,
        message: `✅ Authorization successful! Copy your token data (everything, including the curly braces), then press Done to continue
      iMessage2Spotify setup.`,
        error: null,
      },
    };
  } catch (error: any) {
    return {
      props: {
        message:
          "💥 An error occurred while requesting an access token via Spotify.",
        data: null,
        error: error.response.body.error_description,
      },
    };
  }
};

export default Callback;
