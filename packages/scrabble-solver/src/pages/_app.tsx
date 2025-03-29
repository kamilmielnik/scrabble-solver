import { FloatingDelayGroup } from '@floating-ui/react';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import { type FunctionComponent } from 'react';
import { Provider } from 'react-redux';

import { SeoMessage } from 'components';
import { store } from 'state';

import 'styles/global.scss';

const DESCRIPTION =
  // eslint-disable-next-line max-len
  'Scrabble Solver 2 - Free and open-source analysis tool for Scrabble, Scrabble Duel, Super Scrabble, Letter League & Literaki. Quickly find top scoring words using given letters and board state. Available in English, French, German, Persian, Polish, Romanian, Spanish, and Turkish.';

const KEYWORDS = [
  'Scrabble Solver',
  'Scrabble',
  'Scrabble Duel',
  'Solver',
  'Super Scrabble',
  'Kelimelik',
  'Letter League',
  'Literaki',
  'Board',
  'Open-source',
  'Open',
  'Source',
  'Word',
  'Finder',
  'Cheating',
  'Word',
  'English',
  'Français',
  'French',
  'Deutsch',
  'German',
  'Polski',
  'Polish',
  'فارسی',
  'Farsi',
  'Español',
  'Spanish',
  'Română',
  'Romanian',
  'Türkçe',
  'Turkish',
  'SOWPODS',
  'TWL06',
  'SJP',
  'FISE-2017',
  'FISE-2',
  'CNRTL',
  'Kamil Mielnik',
].join(',');

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
      <meta property="og:title" content={DESCRIPTION} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://scrabble-solver.org" />
      <meta property="og:image" content="https://scrabble-solver.org/og.png" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={DESCRIPTION} />
    </Head>

    <Provider store={store}>
      <SeoMessage />

      <FloatingDelayGroup delay={0}>
        <Component {...pageProps} />
      </FloatingDelayGroup>
    </Provider>
  </>
);

export default App;
