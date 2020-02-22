# scrabble-solver

Available at: http://scrabble-solver.kamilmielnik.com/ (use npm version for better performance, your machine is most likely faster than this server)

![alt frontend](https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/screenshot.png)

### Quick run
1. `npm install -g scrabble-solver`
2. `scrabble-solver`

### Usage
- put your letters in the `TILES` input field and hit `Enter` to find possible solutions for them on the board
- space (` `) means a blank tile (using blanks increases the time to find results)
- sort results by clicking on table headers
- `INDEX` is `POINTS` to `#TILES` ratio
- hover over a result to see where it fits on the board and find the word definition
- click on a result to put it on the board
- filtering results works with regular expressions (e.g. `is$` for words ending with `is`)
- navigate through cells on the board with arrow keys
- when cell on the board is focused
  - type a letter to put a tile
  - hit `Backspace`, `Delete` or `Space` to remove a tile
  - hit `Ctrl + B` or `Command + B` to toggle tile blank (important, because blanks are worth `0` points)
  - hit `Enter` to search for results
- put a word in `FIND WORD DEFINITION` input field and hit `Enter` to find its definition

### Full build
1. `npm install`
2. `npm run build`
3. `npm start`

### Works with
- node 7.9.0


----

# History

My baby.

Back in January 2012 I wrote 200 lines of C++ code to load up a dictionary, store it in a Trie structure, read up to 7 letters from console input and traverse the Trie structure to find all the words that could be created from provided letters. I did it for 200 PLN (about 60 USD back then) and it was my first money earned by programming (assuming that beer is not a currency).

I enjoyed working on it and wanted to enhance that with some visuals to take it to the next level. So I created a simple Windows Forms project in C#, added support for "blank" characters & displayed the results grouped by word length. And I left it like that.

Some time later I got familiar with WPF and somehow I got the idea it would be fun to enhance the C# solver with a visual board input. This would provide solver with information which would allow to find a move that will give you the most points. So in September 2014 I started working on a new C# WPF project, but I haven't got far with it.

Seasons change, time passes by, as the weeks become the months become the years [...](http://southpark.cc.com/clips/103831/deep-coma)

After getting experienced with JavaScript, I decided to tackle the challenge once again. I started a new project in February 2017. React on the front, node.js in the back. On September 13th 2017, five and a half years since the beginning, `scrabble-solver@1.0.0` was released. And I saw it was good.

~My mind is at piece ever since. I don't even have nightmares anymore. Or dreams. Or goals.~

~It's at `1.4.0` now. I have added en-US & en-GB locales support, a mini tutorial and kept the dependencies up to date (e.g. upgraded React from 15 to 16).~

Seasons change, time passes by, as the weeks become the months become the years [...](http://southpark.cc.com/clips/103831/deep-coma)

Frontend development has changed, I've learned a few things. It's time for `scrabble-solver@2.0.0`. In 2019 I started to work on a new version. But due to many distractions the work is still ongoing.
The plans for `2.0.0` are:
- new UI
- split the project into multiple packages (monorepo)
- abuse React hooks usage

I also have plans for `3.0.0`:
- TypeScript

There's no deadline for this. 
