import Head from 'next/head';
import { type FunctionComponent } from 'react';

import { NotFound } from '@/components/NotFound';

const NotFoundPage: FunctionComponent = () => (
  <>
    <Head>
      <title>Page not found - Scrabble Solver</title>
    </Head>

    <NotFound />
  </>
);

export default NotFoundPage;
