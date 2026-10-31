import { Gaddag } from '@kamilmielnik/gaddag';
import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { Board, Game, Locale, Tile } from '@scrabble-solver/types';
import { type Mock, afterAll, beforeAll, describe, expect, it, spyOn } from 'bun:test';

import { solve } from '../src';

import { MEASURED_RUNS, runBenchmarks } from './runBenchmarks';
import { LANGUAGE_SCENARIOS } from './scenarios';
import { type Measurement } from './types';

const ENGLISH_GADDAG = Gaddag.fromArray(['as', 'at', 'in', 'rate', 'sat', 'tin', 'tins']);
const POLISH_GADDAG = Gaddag.fromArray(['as', 'na', 'ona', 'on', 'sen', 'ser']);

describe('runBenchmarks', () => {
  let getDictionary: Mock<typeof dictionaries.get>;
  let log: Mock<typeof console.log>;
  let measurements: Measurement[];

  beforeAll(async () => {
    getDictionary = spyOn(dictionaries, 'get').mockImplementation(getSmallGaddag);
    log = spyOn(console, 'log').mockImplementation(() => undefined);
    measurements = await runBenchmarks();
  });

  afterAll(() => {
    getDictionary.mockRestore();
    log.mockRestore();
  });

  it('measures every scenario with zero, one and two blanks, in scenario order', () => {
    expect(measurements.map(({ blanksCount, label, locale }) => [label, locale, blanksCount])).toEqual([
      ['English (US)', Locale.EN_US, 0],
      ['English (US)', Locale.EN_US, 1],
      ['English (US)', Locale.EN_US, 2],
      ['English (GB)', Locale.EN_GB, 0],
      ['English (GB)', Locale.EN_GB, 1],
      ['English (GB)', Locale.EN_GB, 2],
      ['Polish', Locale.PL_PL, 0],
      ['Polish', Locale.PL_PL, 1],
      ['Polish', Locale.PL_PL, 2],
    ]);
  });

  it('asks for the dictionary of each locale', () => {
    expect(getDictionary.mock.calls.map(([locale]) => locale)).toEqual([Locale.EN_US, Locale.EN_GB, Locale.PL_PL]);
  });

  it('keeps only the measured runs, without the warmup', () => {
    expect(measurements.every(({ durations }) => durations.length === MEASURED_RUNS)).toBe(true);
  });

  it('rounds durations to hundredths of a millisecond', () => {
    const durations = measurements.flatMap((measurement) => measurement.durations);
    expect(durations.every((duration) => duration >= 0 && Number(duration.toFixed(2)) === duration)).toBe(true);
  });

  it('replaces rack tiles with blanks from the end of the rack', () => {
    for (const measurement of measurements) {
      expect(measurement.resultsCount).toBeGreaterThan(0);
      expect(measurement.resultsCount).toBe(countResults(measurement));
    }
  });

  it('finds more moves with more blanks on the rack', () => {
    const [noBlanks, oneBlank, twoBlanks] = measurements;
    expect(oneBlank.resultsCount).toBeGreaterThan(noBlanks.resultsCount);
    expect(twoBlanks.resultsCount).toBeGreaterThan(oneBlank.resultsCount);
  });

  it('logs one progress line per measurement', () => {
    expect(log.mock.calls).toHaveLength(measurements.length);
    expect(String(log.mock.calls[1][0])).toMatch(
      new RegExp(`^English \\(US\\) - 1 blank - median \\d+ ms - ${measurements[1].resultsCount} results$`),
    );
  });
});

function getSmallGaddag(locale: Locale): Promise<Gaddag> {
  return Promise.resolve(locale === Locale.PL_PL ? POLISH_GADDAG : ENGLISH_GADDAG);
}

function countResults({ blanksCount, label, locale }: Measurement): number {
  const scenario = LANGUAGE_SCENARIOS.find((candidate) => candidate.label === label);

  if (!scenario) {
    throw new Error(`Missing scenario "${label}"`);
  }

  const lastLetterIndex = scenario.baseRack.length - blanksCount;
  const letters = scenario.baseRack.slice(0, lastLetterIndex).map((character) => new Tile({ character }));
  const blanks = Array.from({ length: blanksCount }, () => new Tile({ character: BLANK, isBlank: true }));
  const gaddag = locale === Locale.PL_PL ? POLISH_GADDAG : ENGLISH_GADDAG;
  const board = Board.fromStringArray(scenario.boardRows);
  return solve(gaddag, getConfig(Game.Scrabble, locale), board, [...letters, ...blanks]).length;
}
