import fs from 'node:fs';
import path from 'node:path';

import { renderChart } from './renderChart';
import { runBenchmarks } from './runBenchmarks';
import { updateReadme } from './updateReadme';

const RESULTS_DIRECTORY = path.join(import.meta.dir, 'results');

const measurements = await runBenchmarks();

fs.mkdirSync(RESULTS_DIRECTORY, { recursive: true });
fs.writeFileSync(path.join(RESULTS_DIRECTORY, 'chart.svg'), `${renderChart(measurements)}\n`);
updateReadme(measurements);
console.log('Updated README.md and benchmarks/results/chart.svg');
