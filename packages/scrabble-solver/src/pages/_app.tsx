import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import 'styles/global.scss';

const NAME = 'Kamil Mielnik';
const DESCRIPTION = 'Scrabble Solver';
const KEYWORDS = ['Scrabble', 'Literaki', 'Solver', NAME].join(',');

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Scrabble Solver</title>
      <meta charSet="utf-8" />
      <meta name="author" content={NAME} />
      <meta name="description" content={DESCRIPTION} />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="robots" content="index, follow, notranslate, noimageindex" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

    <Component {...pageProps} />
  </>
);

export default App;
