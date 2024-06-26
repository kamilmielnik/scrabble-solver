<div align="center">
  <p>
    <a href="https://scrabble-solver.org">
      <img alt="Scrabble Solver logo" height="120" src="https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/packages/scrabble-solver/public/logo.svg" />
    </a>
  </p>

  <p>
    Free, open-source, and cross-platform analysis tool for <a href="https://en.wikipedia.org/wiki/Scrabble">Scrabble</a>, <a href="https://en.wikipedia.org/wiki/Super_Scrabble">Super Scrabble</a> &amp; <a href="https://pl.wikipedia.org/wiki/Literaki">Literaki</a>.
  </p>

  <p>
    Quickly find top scoring words using given letters and board state.
  </p>

  <p>
    Available at <a href="https://scrabble-solver.org">https://scrabble-solver.org</a> in 8 languages.
  </p>

  <p>
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1ec-1f1e7.svg" alt="Flag of United Kingdom" title="English (GB)" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1fa-1f1f8.svg" alt="Flag of United States" title="English (US)" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1eb-1f1f7.svg" alt="Flag of France" title="French" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1e9-1f1ea.svg" alt="Flag of Germany" title="German" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1ee-1f1f7.svg" alt="Flag of Iran" title="Persian" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1f5-1f1f1.svg" alt="Flag of Poland" title="Polish" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1f7-1f1f4.svg" alt="Flag of Romania" title="Romanian" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1ea-1f1f8.svg" alt="Flag of Spain" title="Spanish" />
  </p>

  <p>
    <img src="https://img.shields.io/github/package-json/v/kamilmielnik/scrabble-solver" alt="Version" />
    <img src="https://img.shields.io/npm/l/scrabble-solver" alt="License" />
    <img src="https://img.shields.io/node/v/scrabble-solver" alt="Node version" />
  </p>

  <p>
    <img src="https://github.com/kamilmielnik/scrabble-solver/workflows/Build/badge.svg" alt="Build" />
    <img src="https://github.com/kamilmielnik/scrabble-solver/workflows/Test/badge.svg" alt="Test" />
    <img src="https://github.com/kamilmielnik/scrabble-solver/workflows/ESLint/badge.svg" alt="ESLint" />
  </p>

  <img alt="Screencast GIF showing user interface when solving for oxyphenbutazone, which is a top-scoring word in English version of Scrabble" src="https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/screencast.gif" />
</div>

# scrabble-solver

## Table of contents

1. [Dictionaries](#dictionaries)
2. [Run](#run)
3. [Uninstall](#uninstall)
4. [Develop](#develop)
    1. [Setup](#setup)
    2. [Run app dev server](#run-app-dev-server)
    3. [Rebuild a single package](#rebuild-a-single-package)
    4. [Add a new language](#add-a-new-language)
5. [Tech stack](#tech-stack)
6. [Related projects](#related-projects)
7. [Media](#media)

## Dictionaries

| Language    | Word list                                                                                                                                                                                              | Word definitions                                    | [Highest-scoring word](https://codesandbox.io/s/highest-scoring-words-in-scrabble-vbj1ns?file=/src/index.js) |
|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| 🇬🇧 English  | [💾](https://www.wordgamedictionary.com/sowpods/download/sowpods.txt) [SOWPODS](https://en.wikipedia.org/wiki/Collins_Scrabble_Words)                                                                   | [Merriam-Webster](https://www.merriam-webster.com/) | oxyphenbutazone (1458)                                                                                       |
| 🇺🇸 English  | [💾](https://www.wordgamedictionary.com/twl06/download/twl06.txt) [TWL06](https://en.wikipedia.org/wiki/NASPA_Word_List)                                                                                | [Merriam-Webster](https://www.merriam-webster.com/) | oxyphenbutazone (1458)                                                                                       |
| 🇫🇷 French   | [💾](https://raw.githubusercontent.com/Thecoolsim/French-Scrabble-ODS8/main/French%20ODS%20dictionary.txt) [ODS8](https://github.com/Thecoolsim/French-Scrabble-ODS8)                                   | [CNRTL](https://www.cnrtl.fr/)                      | schizothymiques (1566)                                                                                       |
| 🇩🇪 German   | [💾](https://raw.githubusercontent.com/hippler/german-wordlist/master/words.txt) [hippler/german-wordlist](https://github.com/hippler/german-wordlist)                                                  | [DWDS](https://www.dwds.de)                         | polytoxikomanem (1512)                                                                                       |
| 🇮🇷 Persian  | [💾](https://raw.githubusercontent.com/MansourM/persian-to-persian-dictionary/main/moein/words.txt) [MansourM/persian-to-persian-dictionary](https://github.com/MansourM/persian-to-persian-dictionary) | [واژه یاب](https://vajehyab.com)                    | ‏(756) اگزیستانسیالیست                                                                                        |
| 🇵🇱 Polish   | [💾](https://sjp.pl/slownik/growy/) [SJP.PL](https://sjp.pl/slownik/dp.phtml)                                                                                                                           | [SJP.PL](https://sjp.pl)                            | współposiądźmyż (1512)                                                                                       |
| 🇷🇴 Romanian | [💾](https://dexonline.ro/static/download/scrabble/loc-flexiuni-5.0.zip) [LOC 5](https://dexonline.ro/scrabble)                                                                                         | [dexonline](https://dexonline.ro/)                  | luxemburghezele (1944)                                                                                       |
| 🇪🇸 Spanish  | [💾](https://github.com/kamilmielnik/scrabble-dictionaries/blob/master/spanish/fise-2.txt) [FISE-2](https://fisescrabble.org/)                                                                          | [Diccionarios.com](https://www.diccionarios.com/)   | flexibilizabais (1323)                                                                                       |

## Run

You can run Scrabble Solver on your machine - all you need is [Node.js](https://nodejs.org/) 20 or later.

```Shell
npx scrabble-solver@latest
```

Hit <kbd>Ctrl</kbd> + <kbd>C</kbd> in your terminal to exit the app.

## Uninstall

Dictionaries and logs are stored in `$HOME/.scrabble-solver`.
`$HOME` location is acquired using [`os.homedir()`](https://nodejs.org/api/os.html#oshomedir).

```Shell
rm -rf $HOME/.scrabble-solver
```

## Develop

These steps are required only if you want to make changes to the source code.

### Setup

One-time project setup.

```Shell
git clone https://github.com/kamilmielnik/scrabble-solver.git
cd scrabble-solver
npm install
npm run build
```

### Run app dev server

The following command will serve the app at http://localhost:3000/.

```Shell
npm run dev
```

Note: hot code reload works only for the [`scrabble-solver`](https://github.com/kamilmielnik/scrabble-solver/tree/master/packages/scrabble-solver) package. If you make changes to any other package, you will need to rebuild it ([see below](#rebuild-a-single-package)).

### Rebuild the entire project

```Shell
npm run build
```

### Rebuild a single package

For convenience, here's a list of commands to rebuild every package individually.

```Shell
npm run build -w @scrabble-solver/configs
npm run build -w @scrabble-solver/constants
npm run build -w @scrabble-solver/dictionaries
npm run build -w @scrabble-solver/logger
npm run build -w @scrabble-solver/scrabble-solver
npm run build -w @scrabble-solver/solver
npm run build -w @scrabble-solver/types
npm run build -w @scrabble-solver/word-definitions
npm run build -w @scrabble-solver/word-lists
```

### Add a new language

1. Find and download a flag representing the locale in an SVG format
    - I usually find them at https://commons.wikimedia.org/
2. Rename the file to `FlagXX.svg` and put it in [packages/scrabble-solver/src/icons](https://github.com/kamilmielnik/scrabble-solver/tree/master/packages/scrabble-solver/src/icons)
3. Export the SVG file in [packages/scrabble-solver/src/icons/index.ts](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/scrabble-solver/src/icons/index.ts)
4. Add IETF language tag for the new locale in [packages/types/src/Locale.ts](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/types/src/Locale.ts)
5. Rebuild the types package
   ```Shell
   npm run build -w @scrabble-solver/types
   ```
6. Add locale configuration in [packages/scrabble-solver/src/i18n/constants.ts](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/scrabble-solver/src/i18n/constants.ts)
7. Update locale-detecting code in [packages/scrabble-solver/src/lib/detectLocale.ts](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/scrabble-solver/src/lib/detectLocale.ts)
8. Add game configs for the new locale in [packages/configs/src/languages](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/configs/src/languages)
9. Add an export for these locale configs in [packages/configs/src/languages/index.ts](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/configs/src/languages/index.ts)
10. Add a translation file in [packages/scrabble-solver/src/i18n/languages](https://github.com/kamilmielnik/scrabble-solver/tree/master/packages/scrabble-solver/src/i18n/languages) and fill it with translations
    - Copy any existing file, e.g. `english.json` and modify it
11. Add an entry for the translations in [packages/scrabble-solver/src/i18n/i18n.ts](https://github.com/kamilmielnik/scrabble-solver/tree/master/packages/scrabble-solver/src/i18n/i18n.ts)
12. Add a function to fetch the list of words in the new locale in [packages/word-lists/src/getWordList.ts](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/word-lists/src/getWordList.ts)
13. Add a function to fetch the word definition in the new locale in [packages/word-definitions/src/crawl.ts](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/word-definitions/src/crawl.ts)
14. Add a function to parse the word definition crawled in the previous step in [packages/word-definitions/src/parse.ts](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/word-definitions/src/parse.ts)
    - Bonus points for adding tests in [packages/word-definitions/src/parse.test.ts](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/word-definitions/src/parse.test.ts)

## Tech stack

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [Workbox](https://developer.chrome.com/docs/workbox/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux-Saga](https://redux-saga.js.org/)
- [SCSS](https://sass-lang.com/)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [include-media](https://eduardoboucas.github.io/include-media/)
- [Lerna](https://lerna.js.org/)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Related projects

### Lexatious

The user interface and source code for the web front end of Lexatious is based on Scrabble Solver.

- Web: https://lexatious.com
- GitHub: https://github.com/ericgjackson/lexatious_web

## Media

- [5 Free Scrabble Solver Websites To Quickly Find Top Scoring Words](https://www.ilovefreesoftware.com/05/featured/free-scrabble-solver-websites-to-quickly-find-top-scoring-words.html)
