import { Game } from '../Game';

const games = Object.values(Game);

export const isGame = (locale: unknown): locale is Game => games.includes(locale as Game);
