import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <title>STARGATE — Remote Viewing Training Platform</title>
        <meta name="description" content="STARGATE is a remote viewing training platform built on the declassified U.S. government psychoenergetics program. Practice CRV, ERV, ARV and 12 structured protocols with AI Monitor feedback." />
        <meta name="keywords" content="remote viewing, CRV, coordinate remote viewing, ERV, extended remote viewing, ARV, associative remote viewing, stargate program, psychoenergetics, remote viewing training, CIA stargate, ingo swann, remote viewing app" />
        <meta name="author" content="STARGATE" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://psiop.io" />
        <meta property="og:title" content="STARGATE — Remote Viewing Training Platform" />
        <meta property="og:description" content="Practice remote viewing using the actual declassified U.S. government protocols. 12 structured viewing modes. AI Monitor feedback. Blind targeting." />
        <meta property="og:site_name" content="STARGATE" />

        {/* Twitter/X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://psiop.io" />
        <meta name="twitter:title" content="STARGATE — Remote Viewing Training Platform" />
        <meta name="twitter:description" content="Practice remote viewing using the actual declassified U.S. government protocols. 12 structured viewing modes. AI Monitor feedback. Blind targeting." />

        {/* Canonical */}
        <link rel="canonical" href="https://psiop.io" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}