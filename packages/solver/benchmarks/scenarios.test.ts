import { getConfig } from '@scrabble-solver/configs';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { type Config, Game } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { LANGUAGE_SCENARIOS } from './scenarios';
import { type LanguageScenario } from './types';

describe('LANGUAGE_SCENARIOS', () => {
  it('compares the three languages the README promises', () => {
    expect(LANGUAGE_SCENARIOS.map(({ label }) => label)).toEqual(['English (US)', 'English (GB)', 'Polish']);
  });

  it.each(LANGUAGE_SCENARIOS.map((scenario) => [scenario.label, scenario] as const))(
    '%s uses a board of the Scrabble dimensions',
    (_, scenario) => {
      const config = getScrabbleConfig(scenario);
      expect(scenario.boardRows).toHaveLength(config.boardHeight);
      expect(scenario.boardRows.every((row) => row.length === config.boardWidth)).toBe(true);
    },
  );

  it.each(LANGUAGE_SCENARIOS.map((scenario) => [scenario.label, scenario] as const))(
    '%s uses a full rack',
    (_, scenario) => {
      expect(scenario.baseRack).toHaveLength(getScrabbleConfig(scenario).rackSize);
    },
  );

  it.each(LANGUAGE_SCENARIOS.map((scenario) => [scenario.label, scenario] as const))(
    '%s only holds tiles of its alphabet',
    (_, scenario) => {
      const { alphabet } = getScrabbleConfig(scenario);
      const boardCharacters = scenario.boardRows.join('').split('').filter(isTile);
      expect(boardCharacters.length).toBeGreaterThan(0);
      expect(boardCharacters.filter((character) => !alphabet.includes(character))).toEqual([]);
      expect(scenario.baseRack.filter((character) => !alphabet.includes(character))).toEqual([]);
    },
  );
});

function getScrabbleConfig({ locale }: LanguageScenario): Config {
  return getConfig(Game.Scrabble, locale);
}

function isTile(character: string): boolean {
  return character !== EMPTY_CELL;
}
