# scrabble-solver

![alt frontend](https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/screenshot.png)

### Usage
- put your characters in the `CHARACTERS` input field and hit `Enter` to find possible solutions for it on the board
- sort results by clicking on table headers
- hover over a result to see where it fits on the board and find the word definition
- click on a result to put it on the board
- filtering results works with regular expressions (e.g. `is$` for words ending with `is`)
- navigate through cells on the board with arrow keys
- when cell on the board is focused
  - type a letter to put a tile
  - hit `Backspace`, `Delete` or `Space` to remove a tile
  - hit `Ctrl + B` or `Command + B` to toggle tile blank (important, because blanks are worth `0` points)
  - hit `Enter` to search for results
- put a word in `SEARCH DICTIONARY` input field and hit `Enter` to find its definition


### Works with
- node 7.9.0

### Quick run
1. `npm install`
2. `npm start`

### Full build
1. `npm install`
2. `npm run build`
3. `npm start`
