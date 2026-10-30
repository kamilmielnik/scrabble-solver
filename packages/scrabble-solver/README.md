# scrabble-solver

Free, open-source, cross-platform, multi-language analysis tool for Scrabble, Scrabble Duel, Super Scrabble, Letter League, Crossplay, Literaki, Kelimelik, Wyrazy, and Wordfeud. Quickly find the top-scoring words using the given board and tiles.

Available at: https://scrabble-solver.org/

<img alt="Screencast GIF showing user interface when solving for oxyphenbutazone, which is a top-scoring word in English version of Scrabble" src="https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/screencast.gif" />

## Run

You can run Scrabble Solver on your machine - all you need is [Bun](https://bun.sh/) 1.4 or later.

```Shell
bunx scrabble-solver@latest
```

Alternatively you can use [Node.js](https://nodejs.org/) 24 or later instead.

```Shell
npx scrabble-solver@latest
```

Give it a while to install and download dictionaries. When it's done it will automatically open http://localhost:3333/ in your browser.

Hit <kbd>Ctrl</kbd> + <kbd>C</kbd> in your terminal to exit the app and shut down the server.

## Scripts

### `bun run build`

Run production build and place the output in `./next/`.

### `bun run dev`

Run development server with hot-reload.

### `bun start`

Run production server.
