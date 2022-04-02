import got, { OptionsOfJSONResponseBody } from "got";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { SPOTIFY_CLIENT_SECRET_BASE64 } from "../lib/constants";

const Callback = ({ data, message }: { data: any; message: string }) => {
  return (
    <div>
      <Head>
        <title>iMessage2Spotify - Spotify Token Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>IMESSAGE2SPOTIFY – SPOTIFY TOKEN DATA</h1>
        <p>{message}</p>
        {data && (
          <textarea
            contentEditable={false}
            readOnly={true}
            id="token-data"
            value={JSON.stringify(data)}
          ></textarea>
        )}
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
          "Unsuccessful. Please log out of Spotify in Safari and try again.",
      },
    };
  }

  const reqConfig: OptionsOfJSONResponseBody = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "authorization_code",
      redirect_uri: process.env.SPOTIFY_CALLBACK_URI,
      code,
    },
    headers: {
      Authorization: `Basic ${SPOTIFY_CLIENT_SECRET_BASE64}`,
    },
    responseType: "json",
  };

  const data = await got(reqConfig).json();

  return {
    props: {
      data,
      message: `✅ Authorization successful! Your authorization tokens are below.
    Select and copy your token data, then press Done to continue
    iMessage2Spotify setup.`,
    },
  };
};

export default Callback;
