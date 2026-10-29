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
        <meta content="Kamil Mielnik" name="author" />
        <meta content={SITE_DESCRIPTION} name="description" />
        {isIndexable ? <link href={`${SITE_URL}/`} rel="canonical" /> : <meta content="noindex" name="robots" />}
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="Scrabble Solver" property="og:site_name" />
        <meta content={TITLE} property="og:title" />
        <meta content={SITE_DESCRIPTION} property="og:description" />
        <meta content="website" property="og:type" />
        <meta content={`${SITE_URL}/`} property="og:url" />
        <meta content="en_US" property="og:locale" />
        <meta content={`${SITE_URL}/og.png`} property="og:image" />
        <meta content="image/png" property="og:image:type" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        <meta content="Scrabble tiles spelling out Scrabble Solver 2" property="og:image:alt" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={TITLE} name="twitter:title" />
        <meta content={SITE_DESCRIPTION} name="twitter:description" />
        <meta content={`${SITE_URL}/og.png`} name="twitter:image" />
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
