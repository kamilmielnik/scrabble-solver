import { games } from '@scrabble-solver/configs';
import { Game, Locale } from '@scrabble-solver/types';
import fs from 'fs';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import path from 'path';
import { type ReactElement } from 'react';

import { LOCALE_FEATURES } from '@/i18n/constants';
import { CONFIG_PENDING_CLASS } from '@/parameters';

const GAME_DIMENSIONS = Object.fromEntries(
  Object.values(games).map(({ boardHeight, boardWidth, game, rackSize }) => [
    game,
    [boardWidth, boardHeight, rackSize],
  ]),
);

const LOCALE_DIRECTIONS = Object.fromEntries(
  Object.entries(LOCALE_FEATURES).map(([locale, { direction }]) => [locale, direction]),
);

/**
 * The SSR HTML is always an English Scrabble board. This runs before first paint
 * so a returning user's persisted board dimensions and text direction apply without a flash.
 * The board itself cannot be reshaped pre-hydration, so it is hidden (CONFIG_PENDING_CLASS,
 * see global.scss) until hydration applies the persisted config.
 */
const preHydrationScript = `(function () {
  try {
    var settings = JSON.parse(localStorage.getItem('scrabble-solver.settings'));

    if (!settings) {
      return;
    }

    var dimensions = ${JSON.stringify(GAME_DIMENSIONS)}[settings.game];
    var direction = ${JSON.stringify(LOCALE_DIRECTIONS)}[settings.locale];
    var root = document.documentElement;

    if (dimensions) {
      root.style.setProperty('--board-cols', dimensions[0]);
      root.style.setProperty('--board-rows', dimensions[1]);
      root.style.setProperty('--rack-size', dimensions[2]);

      if (settings.game !== ${JSON.stringify(Game.Scrabble)}) {
        root.classList.add(${JSON.stringify(CONFIG_PENDING_CLASS)});
      }
    }

    if (direction) {
      root.dir = direction;
      root.lang = settings.locale;
    }
  } catch (error) {}
})()`;

export default class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html
        /**
         * dir must be present pre-hydration
         */
        dir="ltr"
        /**
         * lang must match the default locale
         */
        lang={Locale.EN_US}
      >
        <InlineCssHead>
          {/* eslint-disable-next-line react/no-danger */}
          <script dangerouslySetInnerHTML={{ __html: preHydrationScript }} />
          <link rel="apple-touch-icon-precomposed" sizes="57x57" href="icons/apple-touch-icon-57x57.png" />
          <link rel="apple-touch-icon-precomposed" sizes="114x114" href="icons/apple-touch-icon-114x114.png" />
          <link rel="apple-touch-icon-precomposed" sizes="72x72" href="icons/apple-touch-icon-72x72.png" />
          <link rel="apple-touch-icon-precomposed" sizes="144x144" href="icons/apple-touch-icon-144x144.png" />
          <link rel="apple-touch-icon-precomposed" sizes="60x60" href="icons/apple-touch-icon-60x60.png" />
          <link rel="apple-touch-icon-precomposed" sizes="120x120" href="icons/apple-touch-icon-120x120.png" />
          <link rel="apple-touch-icon-precomposed" sizes="76x76" href="icons/apple-touch-icon-76x76.png" />
          <link rel="apple-touch-icon-precomposed" sizes="152x152" href="icons/apple-touch-icon-152x152.png" />
          <link rel="icon" type="image/png" href="icons/favicon-196x196.png" sizes="196x196" />
          <link rel="icon" type="image/png" href="icons/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/png" href="icons/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="icons/favicon-16x16.png" sizes="16x16" />
          <link rel="icon" type="image/png" href="icons/favicon-128.png" sizes="128x128" />
          <link rel="icon" href="icons/favicon.svg" />
          <meta name="application-name" content="Scrabble Solver" />
          <meta name="msapplication-TileColor" content="#EFE3AE" />
          <meta name="msapplication-TileImage" content="icons/mstile-144x144.png" />
          <meta name="msapplication-square70x70logo" content="icons/mstile-70x70.png" />
          <meta name="msapplication-square150x150logo" content="icons/mstile-150x150.png" />
          <meta name="msapplication-wide310x150logo" content="icons/mstile-310x150.png" />
          <meta name="msapplication-square310x310logo" content="icons/mstile-310x310.png" />
        </InlineCssHead>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

/**
 * Removes render-blocking CSS requests from the critical path.
 */
class InlineCssHead extends Head {
  getCssLinks(files: Parameters<Head['getCssLinks']>[0]): ReactElement[] | null {
    try {
      const cssFiles = files.allFiles.filter((file) => file.endsWith('.css'));

      return cssFiles.map((file) => (
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: fs.readFileSync(path.join(process.cwd(), '.next', file), 'utf-8'),
          }}
          data-href={`/_next/${file}`}
          key={file}
        />
      ));
    } catch {
      return super.getCssLinks(files);
    }
  }
}
