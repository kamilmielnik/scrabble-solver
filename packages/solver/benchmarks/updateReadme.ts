import fs from 'node:fs';
import path from 'node:path';

import { formatDuration, formatInteger, getMeasurement, median, unique } from './lib';
import { MEASURED_RUNS, WARMUP_RUNS } from './runBenchmarks';
import { type Measurement } from './types';

const README_PATH = path.join(import.meta.dir, '..', 'README.md');

const START_MARKER = '<!-- benchmark-results:start -->';
const END_MARKER = '<!-- benchmark-results:end -->';

export const updateReadme = (measurements: Measurement[]): void => {
  const readme = fs.readFileSync(README_PATH, 'utf-8');
  const startIndex = readme.indexOf(START_MARKER);
  const endIndex = readme.indexOf(END_MARKER);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Cannot update ${README_PATH} - missing "${START_MARKER}" / "${END_MARKER}" markers`);
  }

  const prefix = readme.slice(0, startIndex + START_MARKER.length);
  const suffix = readme.slice(endIndex);
  fs.writeFileSync(README_PATH, `${prefix}\n\n${generateResults(measurements)}\n\n${suffix}`);
};

const generateResults = (measurements: Measurement[]): string => {
  return [
    '![Median solve() duration grouped by number of blanks on the rack](benchmarks/results/chart.svg)',
    generateTable(measurements),
    generateFootnote(),
  ].join('\n\n');
};

const generateTable = (measurements: Measurement[]): string => {
  const blanksCounts = unique(measurements.map((measurement) => measurement.blanksCount)).sort((a, b) => a - b);
  const labels = unique(measurements.map((measurement) => measurement.label));
  const header = `| Blanks | ${labels.join(' | ')} |`;
  const separator = `| ${['---', ...labels.map(() => '---')].join(' | ')} |`;
  const rows = blanksCounts.map((blanksCount) => {
    const cells = labels.map((label) => {
      const measurement = getMeasurement(measurements, label, blanksCount);
      return `${formatDuration(median(measurement.durations))} (${formatInteger(measurement.resultsCount)} results)`;
    });
    return `| ${[blanksCount, ...cells].join(' | ')} |`;
  });

  return [header, separator, ...rows].join('\n');
};

const generateFootnote = (): string => {
  return `Median of ${MEASURED_RUNS} runs (after ${WARMUP_RUNS} warmup runs)`;
};
