import { Locale } from '@scrabble-solver/types';
import { type Mock, afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';

import { type Measurement } from './types';
import { updateReadme } from './updateReadme';

const README_PATH = path.join(import.meta.dir, '..', 'README.md');

const START_MARKER = '<!-- benchmark-results:start -->';
const END_MARKER = '<!-- benchmark-results:end -->';

describe('updateReadme', () => {
  let readmeContent: string;
  let readFileSync: Mock<typeof fs.readFileSync>;
  let writeFileSync: Mock<typeof fs.writeFileSync>;

  beforeEach(() => {
    readmeContent = `# Title\n\n${START_MARKER}\n\nstale results\n\n${END_MARKER}\n\nTail\n`;
    readFileSync = spyOn(fs, 'readFileSync').mockImplementation(
      (() => readmeContent) as unknown as typeof fs.readFileSync,
    );
    writeFileSync = spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
  });

  afterEach(() => {
    readFileSync.mockRestore();
    writeFileSync.mockRestore();
  });

  it('replaces only the text between the markers, keeping the markers', () => {
    updateReadme([createMeasurement('Polish', 0, [10], 5)]);
    const written = getWrittenReadme();
    expect(written).toStartWith(`# Title\n\n${START_MARKER}\n\n![Median solve()`);
    expect(written).toEndWith(`\n\n${END_MARKER}\n\nTail\n`);
    expect(written).not.toContain('stale results');
  });

  it('reads and writes the package README', () => {
    updateReadme([createMeasurement('Polish', 0, [10], 5)]);
    expect(readFileSync).toHaveBeenCalledWith(README_PATH, 'utf-8');
    expect(writeFileSync.mock.calls[0][0]).toBe(README_PATH);
  });

  it('writes the chart, a table with one row per blanks count, and the footnote', () => {
    updateReadme([
      createMeasurement('English', 1, [1500], 1234),
      createMeasurement('Polish', 1, [20, 40, 30], 7),
      createMeasurement('English', 0, [2], 1559),
      createMeasurement('Polish', 0, [3], 1826),
    ]);
    expect(getWrittenResults()).toBe(
      [
        '![Median solve() duration grouped by number of blanks on the rack](benchmarks/results/chart.svg)',
        [
          '| Blanks | English | Polish |',
          '| --- | --- | --- |',
          '| 0 | 2 ms (1,559 results) | 3 ms (1,826 results) |',
          '| 1 | 1.5 s (1,234 results) | 30 ms (7 results) |',
        ].join('\n'),
        'Median of 5 runs (after 5 warmup runs)',
      ].join('\n\n'),
    );
  });

  it('refuses to write when the start marker is missing', () => {
    readmeContent = `# Title\n${END_MARKER}\n`;
    expect(() => updateReadme([createMeasurement('Polish', 0, [10], 5)])).toThrow('missing');
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  it('refuses to write when the end marker is missing', () => {
    readmeContent = `# Title\n${START_MARKER}\n`;
    expect(() => updateReadme([createMeasurement('Polish', 0, [10], 5)])).toThrow('missing');
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  it('refuses to write a table with a hole in it', () => {
    const measurements = [
      createMeasurement('English', 0, [1], 1),
      createMeasurement('English', 1, [1], 1),
      createMeasurement('Polish', 0, [1], 1),
    ];
    expect(() => updateReadme(measurements)).toThrow('Missing measurement for "Polish" with 1 blanks');
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  function getWrittenReadme(): string {
    return writeFileSync.mock.calls[0][1] as string;
  }

  function getWrittenResults(): string {
    const written = getWrittenReadme();
    return written.slice(written.indexOf(START_MARKER) + START_MARKER.length, written.indexOf(END_MARKER)).trim();
  }
});

function createMeasurement(label: string, blanksCount: number, durations: number[], resultsCount: number): Measurement {
  return { blanksCount, durations, label, locale: Locale.EN_US, resultsCount };
}
