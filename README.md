<div align="center">
  <p>
    <a href="https://scrabble-solver.org">
      <img alt="Scrabble Solver logo" height="120" src="https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/img/logo.svg" />
    </a>
  </p>

  <p>
    Free and open-source analysis tool for <a href="https://en.wikipedia.org/wiki/Scrabble">Scrabble</a> and <a href="https://pl.wikipedia.org/wiki/Literaki">Literaki</a>.
  </p>

  <p>
    Quickly find top scoring words using given letters and board state.
  </p>

  <p>
    Available at <a href="https://scrabble-solver.org">https://scrabble-solver.org</a>, in 6 languages.
  </p>

  <p>
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1ec-1f1e7.svg" alt="Flag of United Kingdom" title="English (GB)" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1fa-1f1f8.svg" alt="Flag of United States" title="English (US)" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1eb-1f1f7.svg" alt="Flag of France" title="French" />
    <img height="32" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f1e9-1f1ea.svg" alt="Flag of Germany" title="German" />
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

  <p>
    You can run it on your machine, it's cross-platform - all you need is <a href="https://nodejs.org/">Node.js</a>.
  </p>

  <img alt="Screencast GIF showing user interface when solving for oxyphenbutazone, which is a top-scoring word in English version of Scrabble" src="https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/img/screencast.gif" />
</div>

## Requirements

- [Node.js](https://nodejs.org/) 16+
- min. `1000px x 700px` viewport size (`1500px x 1200px` recommended)

## Run

```Shell
npx scrabble-solver
```

or

```Shell
npm install -g scrabble-solver

# and then run anytime with:
scrabble-solver
```

Open http://localhost:3333/ if it didn't open up for you.

## Uninstall

```Shell
npm uninstall -g scrabble-solver

# The package stores logs and dictionaries in $HOME/.scrabble-solver
# It uses os.homedir() to get $HOME location.
rm -rf $HOME/.scrabble-solver
```

## Dictionaries

| Language   | Word list                                                                  | Word list source                                                                                                                           | Word definitions                                    | [Highest-scoring word](https://codesandbox.io/s/highest-scoring-words-in-scrabble-vbj1ns?file=/src/index.js) |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 🇬🇧 English | [SOWPODS](https://en.wikipedia.org/wiki/Collins_Scrabble_Words)            | [Download](https://www.wordgamedictionary.com/sowpods/download/sowpods.txt)                                                                | [Merriam-Webster](https://www.merriam-webster.com/) | oxyphenbutazone (1458)                                                                                       |
| 🇺🇸 English | [TWL06](https://en.wikipedia.org/wiki/NASPA_Word_List)                     | [Download](https://www.wordgamedictionary.com/twl06/download/twl06.txt)                                                                    | [Merriam-Webster](https://www.merriam-webster.com/) | oxyphenbutazone (1458)                                                                                       |
| 🇫🇷 French  | [hbenbel/French-Dictionary](https://github.com/hbenbel/French-Dictionary/) | [Download](https://raw.githubusercontent.com/hbenbel/French-Dictionary/a573eab10cc798d7d5da7daab4d2ac0259bb46a3/dictionary/dictionary.txt) | [CNRTL](https://www.cnrtl.fr/)                      | encyclopediques (1512)                                                                                       |
| 🇩🇪 German  | [enz/german-wordlist](https://github.com/enz/german-wordlist)              | [Download](https://raw.githubusercontent.com/enz/german-wordlist/master/words)                                                             | [DWDS](https://www.dwds.de)                         | polytoxikomanem (1512)                                                                                       |
| 🇵🇱 Polish  | [SJP.PL](https://sjp.pl/slownik/dp.phtml)                                  | [Download](https://sjp.pl/slownik/growy/)                                                                                                  | [SJP.PL](https://sjp.pl)                            | współposiądźmyż (1512)                                                                                       |
| 🇪🇸 Spanish | [FISE-2](https://fisescrabble.org/)                                        | [Download](https://github.com/kamilmielnik/fise-2/blob/master/fise-2.txt)                                                                  | [Diccionarios.com](https://www.diccionarios.com/)   | flexibilizabais (1323)                                                                                       |

## Tech stack

- [Lerna](https://lerna.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux-Saga](https://redux-saga.js.org/)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
