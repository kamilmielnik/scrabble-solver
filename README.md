# scrabble-solver

The ultimate cheating app for [Scrabble](https://en.wikipedia.org/wiki/Scrabble) and [Literaki](https://pl.wikipedia.org/wiki/Literaki).

Available at http://scrabble-solver.kamilmielnik.com/.
Run it locally for better performance, your machine surely is faster than that server.

![alt frontend](https://raw.githubusercontent.com/kamilmielnik/scrabble-solver/master/screenshot.png)

## Quick run

```Shell
npx scrabble-solver
```

## Permanent install

### Install

```Shell
npm install -g scrabble-solver
```

### Run

```Shell
scrabble-solver
```

## Requirements

`node 12.4.0+` (should work with node `10.0.0+` though)

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

Frontend development has changed, I've learned a few things - it was time for `scrabble-solver@2.0.0`. In 2019 I started to work on a new version. But due to many distractions the work took around 2 years to complete. Nevertheless, here it is, a shiny, state-of-the-art frontend app.
