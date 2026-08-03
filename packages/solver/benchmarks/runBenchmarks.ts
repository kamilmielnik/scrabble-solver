import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { type Gaddag } from '@scrabble-solver/gaddag';
import { Board, type Config, Game, Tile } from '@scrabble-solver/types';

import { solve } from '../src';

import { formatBlanksCount, formatDuration, median } from './lib';
import { LANGUAGE_SCENARIOS, type LanguageScenario } from './scenarios';
import { type Measurement } from './types';

const GAME = Game.Scrabble;
export const MEASURED_RUNS = 5;
export const WARMUP_RUNS = 5;

export const runBenchmarks = async (): Promise<Measurement[]> => {
  const measurements: Measurement[] = [];

  for (const scenario of LANGUAGE_SCENARIOS) {
    const config = getConfig(GAME, scenario.locale);
    const gaddag = await dictionaries.get(scenario.locale);
    assertBoardWordsAreValid(gaddag, scenario);

    for (let blanksCount = 0; blanksCount <= config.blanksCount; blanksCount++) {
      const measurement = measureScenario(gaddag, config, scenario, blanksCount);
      console.log(
        `${scenario.label} - ${formatBlanksCount(blanksCount)} - median ${formatDuration(median(measurement.durations))} - ${measurement.resultsCount} results`,
      );
      measurements.push(measurement);
    }
  }

  return measurements;
};

const measureScenario = (
  gaddag: Gaddag,
  config: Config,
  scenario: LanguageScenario,
  blanksCount: number,
): Measurement => {
  const durations: number[] = [];
  let resultsCount = 0;

  for (let run = 0; run < WARMUP_RUNS + MEASURED_RUNS; run++) {
    const board = Board.fromStringArray(scenario.boardRows);
    const tiles = generateRack(scenario.baseRack, blanksCount);
    const start = performance.now();
    const results = solve(gaddag, config, board, tiles);
    const duration = performance.now() - start;

    if (results.length === 0) {
      throw new Error(`No results for ${scenario.locale} with ${blanksCount} blanks`);
    }

    if (run >= WARMUP_RUNS) {
      durations.push(Number(duration.toFixed(2)));
    }

    resultsCount = results.length;
  }

  return { blanksCount, durations, label: scenario.label, locale: scenario.locale, resultsCount };
};

const generateRack = (baseRack: string[], blanksCount: number): Tile[] => {
  return baseRack
    .map((character, index) => (index < baseRack.length - blanksCount ? character : BLANK))
    .map((character) => new Tile({ character, isBlank: character === BLANK }));
};

const assertBoardWordsAreValid = (gaddag: Gaddag, scenario: LanguageScenario): void => {
  const invalidWords = scenario.boardWords.filter((word) => !gaddag.has(word));

  if (invalidWords.length > 0) {
    throw new Error(`Words not present in ${scenario.locale} dictionary: ${invalidWords.join(', ')}`);
  }
};
