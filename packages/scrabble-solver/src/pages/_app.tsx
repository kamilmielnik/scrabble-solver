import { FloatingDelayGroup } from '@floating-ui/react';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import { type FunctionComponent } from 'react';
import { Provider } from 'react-redux';

import { SITE_DESCRIPTION, SITE_URL } from '@/parameters';
import { store } from '@/state';

import '../styles/global.scss';

const TITLE = 'Scrabble Solver 2 - Board Solver & Word Finder';

const App: FunctionComponent<AppProps> = ({ Component, pageProps, router }) => {
  const isIndexable = router.pathname === '/';

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta charSet="utf-8" />
        <meta name="author" content="Kamil Mielnik" />
        <meta name="description" content={SITE_DESCRIPTION} />
        {isIndexable ? <link rel="canonical" href={`${SITE_URL}/`} /> : <meta name="robots" content="noindex" />}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:site_name" content="Scrabble Solver" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content={`${SITE_URL}/og.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Scrabble tiles spelling out Scrabble Solver 2" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og.png`} />
      </Head>

      <Provider store={store}>
        <FloatingDelayGroup delay={0}>
          <Component {...pageProps} />
        </FloatingDelayGroup>
      </Provider>
    </>
  );
};

export default App;
