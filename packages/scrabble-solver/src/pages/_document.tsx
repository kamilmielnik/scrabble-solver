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
          <link href="/icons/apple-touch-icon-57x57.png" rel="apple-touch-icon-precomposed" sizes="57x57" />
          <link href="/icons/apple-touch-icon-114x114.png" rel="apple-touch-icon-precomposed" sizes="114x114" />
          <link href="/icons/apple-touch-icon-72x72.png" rel="apple-touch-icon-precomposed" sizes="72x72" />
          <link href="/icons/apple-touch-icon-144x144.png" rel="apple-touch-icon-precomposed" sizes="144x144" />
          <link href="/icons/apple-touch-icon-60x60.png" rel="apple-touch-icon-precomposed" sizes="60x60" />
          <link href="/icons/apple-touch-icon-120x120.png" rel="apple-touch-icon-precomposed" sizes="120x120" />
          <link href="/icons/apple-touch-icon-76x76.png" rel="apple-touch-icon-precomposed" sizes="76x76" />
          <link href="/icons/apple-touch-icon-152x152.png" rel="apple-touch-icon-precomposed" sizes="152x152" />
          <link href="/icons/favicon-196x196.png" rel="icon" sizes="196x196" type="image/png" />
          <link href="/icons/favicon-96x96.png" rel="icon" sizes="96x96" type="image/png" />
          <link href="/icons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/icons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/icons/favicon-128.png" rel="icon" sizes="128x128" type="image/png" />
          <link href="/icons/favicon.svg" rel="icon" />
          <link href="/site.webmanifest" rel="manifest" />
          <meta content="Scrabble Solver" name="application-name" />
          <meta content="#EFE3AE" name="theme-color" />
          <meta content="#EFE3AE" name="msapplication-TileColor" />
          <meta content="/icons/mstile-144x144.png" name="msapplication-TileImage" />
          <meta content="/icons/mstile-70x70.png" name="msapplication-square70x70logo" />
          <meta content="/icons/mstile-150x150.png" name="msapplication-square150x150logo" />
          <meta content="/icons/mstile-310x150.png" name="msapplication-wide310x150logo" />
          <meta content="/icons/mstile-310x310.png" name="msapplication-square310x310logo" />
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
