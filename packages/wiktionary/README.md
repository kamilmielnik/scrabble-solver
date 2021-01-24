# @scrabble-solver/wiktionary

Fetches [WordDefinition](https://github.com/kamilmielnik/scrabble-solver/blob/master/packages/types/src/WordDefinition.ts) of a given word in a given language from [Wiktionary](https://www.wiktionary.org/). It supports all 174 languages.

## Usage

```ts
import { getWordDefinition } from '@scrabble-solver/wiktionary';

async function main() {
  const { definitions, isAllowed, word } = await getWordDefinition('en', 'feline');

  console.log(`"${word}" - ${isAllowed ? '👍' : '👎'}`); // "feline" - 👍
  console.log(JSON.stringify(definitions, null, 2)); // ["Of or pertaining to cats.","catlike (resembling a cat)"]
}
```
