import type { NextPage } from "next";
import Head from "next/head";
import Scene from "../components/Scene";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mercedes GLS 580 rendered using react-three-fiber</title>
        <meta
          prefix="og: http://ogp.me/ns#"
          property="og:title"
          content="Mercedes GLS 580 rendered using react-three-fiber"
        />
        <meta
          prefix="og: http://ogp.me/ns#"
          property="og:image"
          content="https://vehicle-explorer.vercel.app/meta-image.jpg"
        />
        <meta
          prefix="og: http://ogp.me/ns#"
          property="og:url"
          content="https://vehicle-explorer.vercel.app/"
        />
      </Head>
      <Scene />
    </>
  );
};

export default Home;
