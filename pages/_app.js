import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Winston Chikazhe — AI & Full-Stack Engineer</title>
        <meta name="description" content="Winston Chikazhe is an AI and Full-Stack Engineer based in Lusaka, Zambia. 7+ years building intelligent systems and web applications for clients in the US, Canada and beyond." />
        <meta name="author" content="Winston Chikazhe" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="Winston Chikazhe — AI & Full-Stack Engineer" />
        <meta property="og:description" content="7+ years building AI systems and web applications remotely for clients in the US, Canada and beyond." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://winston.work/" />
        <meta property="og:image" content="https://winston.work/assets/images/three.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Winston Chikazhe — AI & Full-Stack Engineer" />
        <meta name="twitter:description" content="7+ years building AI systems and web applications remotely." />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
