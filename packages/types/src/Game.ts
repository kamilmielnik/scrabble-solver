// eslint-disable-next-line no-shadow
enum Game {
  Literaki = 'literaki',
  Scrabble = 'scrabble',
}

const games = Object.values(Game);

export const isGame = (locale: unknown): locale is Game => games.includes(locale as Game);

export default Game;
