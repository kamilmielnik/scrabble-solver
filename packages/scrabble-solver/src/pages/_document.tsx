import Document, { Head, Html, Main, NextScript } from 'next/document';
import React, { ReactElement } from 'react';

class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html lang="en">
        <Head>
          <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
          <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
