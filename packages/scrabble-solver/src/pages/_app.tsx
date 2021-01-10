import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';
import { Provider } from 'react-redux';

import { createAppStore } from 'state';

import 'styles/global.scss';

const DESCRIPTION = 'Scrabble Solver 2 - The ultimate cheating app for Scrabble and Literaki';
const KEYWORDS = [
  'Scrabble',
  'Literaki',
  'Solver',
  'Cheating',
  'JavaScript',
  'JS',
  'TypeScript',
  'TS',
  'Kamil Mielnik',
].join(',');

const store = createAppStore();

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Scrabble Solver 2 by Kamil Mielnik</title>
      <meta charSet="utf-8" />
      <meta name="author" content="Kamil Mielnik" />
      <meta name="description" content={DESCRIPTION} />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="robots" content="index, follow, notranslate, noimageindex" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  </>
);

export default App;
