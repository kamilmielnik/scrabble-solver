import fs from 'node:fs';
import path from 'node:path';

import { median } from './lib';
import { renderChart } from './renderChart';
import { runBenchmarks } from './runBenchmarks';
import { updateReadme } from './updateReadme';

const RESULTS_DIRECTORY = path.join(import.meta.dir, 'results');

const measurements = await runBenchmarks();
const results = measurements.map((measurement) => ({
  ...measurement,
  medianDuration: median(measurement.durations),
}));

fs.mkdirSync(RESULTS_DIRECTORY, { recursive: true });
fs.writeFileSync(path.join(RESULTS_DIRECTORY, 'chart.svg'), `${renderChart(measurements)}\n`);
fs.writeFileSync(path.join(RESULTS_DIRECTORY, 'results.json'), `${JSON.stringify(results, null, 2)}\n`);
updateReadme(measurements);
console.log('Updated README.md, benchmarks/results/chart.svg, benchmarks/results/results.json');
