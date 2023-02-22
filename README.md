<div align="center">
  <p>
    <a href="https://scrabble-solver.org">
      <img alt="Scrabble Solver logo" height="120" src="https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/packages/scrabble-solver/src/components/Logo/Logo.svg" />
    </a>
  </p>

  <p>
    Free, open-source, and cross-platform analysis tool for <a href="https://en.wikipedia.org/wiki/Scrabble">Scrabble</a> &amp; <a href="https://pl.wikipedia.org/wiki/Literaki">Literaki</a>.
  </p>

  <p>
    Quickly find top scoring words using given letters and board state.
  </p>

  <p>
    Available at <a href="https://scrabble-solver.org">https://scrabble-solver.org</a> in 7 languages.
  </p>

  <p>
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1ec-1f1e7.svg" alt="Flag of United Kingdom" title="English (GB)" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1fa-1f1f8.svg" alt="Flag of United States" title="English (US)" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1eb-1f1f7.svg" alt="Flag of France" title="French" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1e9-1f1ea.svg" alt="Flag of Germany" title="German" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1ee-1f1f7.svg" alt="Flag of Iran" title="Persian" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1f5-1f1f1.svg" alt="Flag of Poland" title="Polish" />
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

  <img alt="Screencast GIF showing user interface when solving for oxyphenbutazone, which is a top-scoring word in English version of Scrabble" src="https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/img/screencast.gif" />
</div>

# scrabble-solver

- [Dictionaries](#dictionaries)
- [Run](#run)
- [Uninstall](#uninstall)
- [Develop](#develop)
- [Tech stack](#tech-stack)
- [Related projects](#related-projects)

## Dictionaries

| Language   | Word list                                                                                                                                                                                                       | Word definitions                                    | [Highest-scoring word](https://codesandbox.io/s/highest-scoring-words-in-scrabble-vbj1ns?file=/src/index.js) |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 🇬🇧 English | [💾](https://www.wordgamedictionary.com/sowpods/download/sowpods.txt) [SOWPODS](https://en.wikipedia.org/wiki/Collins_Scrabble_Words)                                                                           | [Merriam-Webster](https://www.merriam-webster.com/) | oxyphenbutazone (1458)                                                                                       |
| 🇺🇸 English | [💾](https://www.wordgamedictionary.com/twl06/download/twl06.txt) [TWL06](https://en.wikipedia.org/wiki/NASPA_Word_List)                                                                                        | [Merriam-Webster](https://www.merriam-webster.com/) | oxyphenbutazone (1458)                                                                                       |
| 🇫🇷 French  | [💾](https://raw.githubusercontent.com/hbenbel/French-Dictionary/a573eab10cc798d7d5da7daab4d2ac0259bb46a3/dictionary/dictionary.txt) [hbenbel/French-Dictionary](https://github.com/hbenbel/French-Dictionary/) | [CNRTL](https://www.cnrtl.fr/)                      | encyclopediques (1512)                                                                                       |
| 🇩🇪 German  | [💾](https://raw.githubusercontent.com/hippler/german-wordlist/master/words.txt) [hippler/german-wordlist](https://github.com/hippler/german-wordlist)                                                          | [DWDS](https://www.dwds.de)                         | polytoxikomanem (1512)                                                                                       |
| 🇮🇷 Persian | [💾](https://raw.githubusercontent.com/MansourM/persian-to-persian-dictionary/main/moein/words.txt) [MansourM/persian-to-persian-dictionary](https://github.com/MansourM/persian-to-persian-dictionary)         | [واژه یاب](https://vajehyab.com)                    | ‏(756) اگزیستانسیالیست                                                                                       |
| 🇵🇱 Polish  | [💾](https://sjp.pl/slownik/growy/) [SJP.PL](https://sjp.pl/slownik/dp.phtml)                                                                                                                                   | [SJP.PL](https://sjp.pl)                            | współposiądźmyż (1512)                                                                                       |
| 🇪🇸 Spanish | [💾](https://github.com/kamilmielnik/fise-2/blob/master/fise-2.txt) [FISE-2](https://fisescrabble.org/)                                                                                                         | [Diccionarios.com](https://www.diccionarios.com/)   | flexibilizabais (1323)                                                                                       |

## Run

You can run Scrabble Solver on your machine - all you need is [Node.js](https://nodejs.org/) 16 or later.

```Shell
npx scrabble-solver
```

or

```Shell
npm install -g scrabble-solver

# and then run anytime with:
scrabble-solver
```

Dictionaries will be downloaded and processed during the first run - this can take a few minutes.

## Uninstall

```Shell
npm uninstall -g scrabble-solver

# The package stores logs and dictionaries in $HOME/.scrabble-solver
# It uses os.homedir() to get $HOME location.
rm -rf $HOME/.scrabble-solver
```

## Develop

### Setup

```Shell
npm install
npm run install:dev
```

### App dev server

```Shell
npx lerna run dev --scope=@scrabble-solver/scrabble-solver
```

- Starts server on [http://localhost:3000](http://localhost:3000)
- Hot code reload works for [`scrabble-solver`](https://github.com/kamilmielnik/scrabble-solver/tree/master/packages/scrabble-solver) package only

### Rebuild a single package

```Shell
npx lerna run build --scope=@scrabble-solver/PACKAGE_NAME_HERE
```

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
