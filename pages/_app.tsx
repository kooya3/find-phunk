import * as React from "react";
import type { AppProps } from "next/app";
import { globalStyles } from "../stitches.config";
import "../critical.css";

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();

  return <Component {...pageProps} />;
}

export default MyApp;
