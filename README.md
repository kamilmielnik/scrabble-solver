![alt Scrabble Solver 2](https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/img/logo.png)

# scrabble-solver

The ultimate cheating app for [Scrabble](https://en.wikipedia.org/wiki/Scrabble) and [Literaki](https://pl.wikipedia.org/wiki/Literaki).

Available at https://scrabble-solver.kamilmielnik.com/ in English, French, Polish & Spanish.

Run it locally for better performance (your machine surely is faster than that server).

It's cross-platform - all you need is [Node.js](https://nodejs.org/).

![Version](https://img.shields.io/github/package-json/v/kamilmielnik/scrabble-solver)
![License](https://img.shields.io/npm/l/scrabble-solver)
![Node version](https://img.shields.io/node/v/scrabble-solver)
![Dependencies](https://img.shields.io/librariesio/release/npm/scrabble-solver)
![Build](https://github.com/kamilmielnik/scrabble-solver/workflows/Build/badge.svg)
![Test](https://github.com/kamilmielnik/scrabble-solver/workflows/Test/badge.svg)
![ESLint](https://github.com/kamilmielnik/scrabble-solver/workflows/ESLint/badge.svg)

![alt User Interface](https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/img/screencast.gif)

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

# The package stores logs and dicionaries in $HOME/.scrabble-solver
# It uses os.homedir() to get $HOME location.
rm -rf $HOME/.scrabble-solver
```

## Requirements

- `node 12.4.0+` (should work with node `10.0.0+` though)
- min. `1000px x 700px` viewport size (`1500px x 1200px` recommended)

## Dictionaries

| Language   | Locale | Word list                                                                  | Word list (source)                                                                                       | Word definitions                                                               |
| ---------- | ------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 🇬🇧 English | en-GB  | [SOWPODS](https://en.wikipedia.org/wiki/Collins_Scrabble_Words)            | [download](https://www.wordgamedictionary.com/sowpods/download/sowpods.txt)                              | [Merriam-Webster](https://www.merriam-webster.com/)                            |
| 🇺🇸 English | en-US  | [TWL06](https://en.wikipedia.org/wiki/NASPA_Word_List)                     | [download](https://www.wordgamedictionary.com/twl06/download/twl06.txt)                                  | [Merriam-Webster](https://www.merriam-webster.com/)                            |
| 🇫🇷 French  | fr-FR  | [hbenbel/French-Dictionary](https://github.com/hbenbel/French-Dictionary/) | [download](https://raw.githubusercontent.com/hbenbel/French-Dictionary/master/dictionary/dictionary.txt) | [Centre National de Ressources Textuelles et Lexicales](https://www.cnrtl.fr/) |
| 🇵🇱 Polish  | pl-PL  | [SJP.PL](https://sjp.pl/slownik/dp.phtml)                                  | [download](https://sjp.pl/slownik/growy/)                                                                | [SJP.PL](https://sjp.pl)                                                       |
| 🇪🇸 Spanish | es-ES  | [FISE-2](https://fisescrabble.org/)                                        | [download](https://github.com/kamilmielnik/fise-2/blob/master/fise-2.txt)                                | [Diccionarios.com](www.diccionarios.com)                                       |

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

## History

Back in January 2012 I wrote 200 lines of C++ code to load up a dictionary, store it in a Trie structure, read up to 7 letters from console input and traverse the Trie structure to find all the words that could be created from provided letters. I did it for 200 PLN (about 60 USD back then) and it was my first money earned by programming (assuming that beer is not a currency).

I enjoyed working on it and wanted to enhance that with some visuals to take it to the next level. So I created a simple Windows Forms project in C#, added support for "blank" characters & displayed the results grouped by word length. And I left it like that.

Some time later I got familiar with WPF and somehow I got the idea it would be fun to enhance the C# solver with a visual board input. This would provide solver with information which would allow to find a move that will give you the most points. So in September 2014 I started working on a new C# WPF project, but I haven't got far with it.

After getting experienced with JavaScript, I decided to tackle the challenge once again. I started a new project in February 2017. React on the front, node.js in the back. On September 13th 2017, five and a half years since the beginning, `scrabble-solver@1.0.0` was released. And I saw it was good.

It got to `1.4.0` - I have added en-US & en-GB locales support, a mini tutorial and kept the dependencies up to date (e.g. upgraded React from 15 to 16).

Frontend development has changed, I've learned a few things - it was time for `scrabble-solver@2.0.0`. In 2019 I started to work on a new version. But due to many distractions the work took around 2 years to complete. Nevertheless, here it is, a shiny, state-of-the-art frontend app, January 2021 - 9 years after the first project.

### Scrabble Solver 1

A piece of history, available at http://scrabble-solver-v1.kamilmielnik.com/.
