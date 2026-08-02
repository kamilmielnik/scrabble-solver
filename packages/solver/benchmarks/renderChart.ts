import { formatBlanksCount, formatDuration, getMeasurement, median, unique } from './lib';
import { type Measurement } from './types';

const WIDTH = 720;
const HEIGHT = 420;
const PLOT_TOP = 96;
const PLOT_BOTTOM = HEIGHT - 48;
const PLOT_LEFT = 56;
const PLOT_RIGHT = WIDTH - 24;
const BAR_WIDTH = 24;
const BAR_PITCH = 44;
const CORNER_RADIUS = 4;
const MAX_TICKS = 6;
const TICK_STEP_MULTIPLIERS = [1, 2, 2.5, 5, 10];
const SCALE_HEADROOM = 1.08;

const STYLE = `
    text { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
    .axis { stroke: #c3c2b7; }
    .grid { stroke: #e1e0d9; }
    .group-label, .legend-label { fill: #52514e; font-size: 12px; }
    .series-0 { fill: #2a78d6; }
    .series-1 { fill: #eb6834; }
    .series-2 { fill: #1baf7a; }
    .subtitle { fill: #898781; font-size: 12px; }
    .surface { fill: #fcfcfb; }
    .tick-label { fill: #898781; font-size: 11px; font-variant-numeric: tabular-nums; }
    .title { fill: #0b0b0b; font-size: 15px; font-weight: 600; }
    .value-label { fill: #52514e; font-size: 11px; }
    @media (prefers-color-scheme: dark) {
      .axis { stroke: #383835; }
      .grid { stroke: #2c2c2a; }
      .group-label, .legend-label, .value-label { fill: #c3c2b7; }
      .series-0 { fill: #3987e5; }
      .series-1 { fill: #d95926; }
      .series-2 { fill: #199e70; }
      .surface { fill: #1a1a19; }
      .title { fill: #ffffff; }
    }`;

export const renderChart = (measurements: Measurement[]): string => {
  const blanksCounts = unique(measurements.map((measurement) => measurement.blanksCount)).sort((a, b) => a - b);
  const labels = unique(measurements.map((measurement) => measurement.label));
  const maxDuration = Math.max(...measurements.map((measurement) => median(measurement.durations)));
  const tickStep = getTickStep(maxDuration * SCALE_HEADROOM);
  const scaleMax = Math.ceil((maxDuration * SCALE_HEADROOM) / tickStep) * tickStep;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="Median solve() duration by number of blanks on the rack, for ${labels.join(', ')}">`,
    `  <style>${STYLE}</style>`,
    `  <rect class="surface" width="${WIDTH}" height="${HEIGHT}" rx="8" />`,
    `  <text class="title" x="24" y="32">solve() median duration</text>`,
    `  <text class="subtitle" x="24" y="50">Scrabble, mid-game board, 7 tiles on the rack, letters replaced by blanks</text>`,
    renderLegend(labels),
    renderScale(tickStep, scaleMax),
    renderBars(measurements, blanksCounts, labels, scaleMax),
    renderGroupLabels(blanksCounts),
    '</svg>',
  ].join('\n');
};

const renderLegend = (labels: string[]): string => {
  let x = 24;

  return labels
    .map((label, index) => {
      const item = [
        `  <rect class="series-${index}" x="${x}" y="63" width="10" height="10" rx="2" />`,
        `  <text class="legend-label" x="${x + 16}" y="73">${label}</text>`,
      ].join('\n');
      x += 16 + Math.ceil(label.length * 6.7) + 24;
      return item;
    })
    .join('\n');
};

const renderScale = (tickStep: number, scaleMax: number): string => {
  const lines: string[] = [];

  for (let tick = 0; tick <= scaleMax; tick += tickStep) {
    const y = getY(tick, scaleMax);
    const lineClass = tick === 0 ? 'axis' : 'grid';
    lines.push(`  <line class="${lineClass}" x1="${PLOT_LEFT}" y1="${y}" x2="${PLOT_RIGHT}" y2="${y}" />`);
    lines.push(
      `  <text class="tick-label" text-anchor="end" x="${PLOT_LEFT - 8}" y="${y + 4}">${formatTick(tick)}</text>`,
    );
  }

  return lines.join('\n');
};

const renderBars = (
  measurements: Measurement[],
  blanksCounts: number[],
  labels: string[],
  scaleMax: number,
): string => {
  return blanksCounts
    .flatMap((blanksCount, groupIndex) =>
      labels.map((label, seriesIndex) => {
        const measurement = getMeasurement(measurements, label, blanksCount);
        const duration = median(measurement.durations);
        const x = getBarX(groupIndex, seriesIndex, blanksCounts.length, labels.length);
        const y = getY(duration, scaleMax);
        return [
          `  <path class="series-${seriesIndex}" d="${getBarPath(x, y)}" />`,
          `  <text class="value-label" text-anchor="middle" x="${round(x + BAR_WIDTH / 2)}" y="${round(y - 6)}">${formatDuration(duration)}</text>`,
        ].join('\n');
      }),
    )
    .join('\n');
};

const renderGroupLabels = (blanksCounts: number[]): string => {
  const bandWidth = (PLOT_RIGHT - PLOT_LEFT) / blanksCounts.length;

  return blanksCounts
    .map((blanksCount, groupIndex) => {
      const x = round(PLOT_LEFT + bandWidth * (groupIndex + 0.5));
      return `  <text class="group-label" text-anchor="middle" x="${x}" y="${PLOT_BOTTOM + 22}">${formatBlanksCount(blanksCount)}</text>`;
    })
    .join('\n');
};

const getBarPath = (x: number, y: number): string => {
  const radius = Math.min(CORNER_RADIUS, (PLOT_BOTTOM - y) / 2);
  return [
    `M ${round(x)} ${PLOT_BOTTOM}`,
    `L ${round(x)} ${round(y + radius)}`,
    `Q ${round(x)} ${round(y)} ${round(x + radius)} ${round(y)}`,
    `L ${round(x + BAR_WIDTH - radius)} ${round(y)}`,
    `Q ${round(x + BAR_WIDTH)} ${round(y)} ${round(x + BAR_WIDTH)} ${round(y + radius)}`,
    `L ${round(x + BAR_WIDTH)} ${PLOT_BOTTOM}`,
    'Z',
  ].join(' ');
};

const getBarX = (groupIndex: number, seriesIndex: number, groupsCount: number, seriesCount: number): number => {
  const bandWidth = (PLOT_RIGHT - PLOT_LEFT) / groupsCount;
  const contentWidth = (seriesCount - 1) * BAR_PITCH + BAR_WIDTH;
  return round(PLOT_LEFT + bandWidth * groupIndex + (bandWidth - contentWidth) / 2 + seriesIndex * BAR_PITCH);
};

const getY = (duration: number, scaleMax: number): number => {
  return round(PLOT_BOTTOM - (duration / scaleMax) * (PLOT_BOTTOM - PLOT_TOP));
};

const getTickStep = (maxValue: number): number => {
  const magnitude = 10 ** Math.floor(Math.log10(maxValue / MAX_TICKS));
  const step = TICK_STEP_MULTIPLIERS.map((multiplier) => multiplier * magnitude).find(
    (candidate) => maxValue / candidate <= MAX_TICKS,
  );

  if (!step) {
    throw new Error(`Cannot pick a tick step for ${maxValue}`);
  }

  return step;
};

const formatTick = (milliseconds: number): string => {
  return milliseconds === 0 ? '0' : `${Number((milliseconds / 1000).toFixed(2))}s`;
};

const round = (value: number): number => Math.round(value * 100) / 100;
