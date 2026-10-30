import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { renderChart } from './renderChart';
import { type Measurement } from './types';

describe('renderChart', () => {
  it('renders a labelled svg naming every series', () => {
    const svg = renderChart([createMeasurement('Polish', 0, [10]), createMeasurement('German', 0, [20])]);
    expect(svg).toStartWith('<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420"');
    expect(svg).toContain('aria-label="Median solve() duration by number of blanks on the rack, for Polish, German"');
    expect(svg).toEndWith('</svg>');
  });

  it('draws one bar per series in every blanks group', () => {
    const svg = renderChart([
      createMeasurement('Polish', 0, [10]),
      createMeasurement('Polish', 1, [20]),
      createMeasurement('German', 0, [30]),
      createMeasurement('German', 1, [40]),
    ]);
    expect(findAll(svg, /<path class="(series-\d)"/g)).toEqual(['series-0', 'series-1', 'series-0', 'series-1']);
  });

  it('places a bar from its median, scaled against the rounded-up top tick', () => {
    const svg = renderChart([createMeasurement('Polish', 0, [10, 30, 20])]);
    expect(svg).toContain(
      '<path class="series-0" d="M 364 372 L 364 155.2 Q 364 151.2 368 151.2 L 384 151.2 Q 388 151.2 388 155.2 L 388 372 Z" />',
    );
    expect(svg).toContain('<text class="value-label" text-anchor="middle" x="376" y="145.2">20 ms</text>');
  });

  it('spaces the bars of a group one pitch apart, centered on their band', () => {
    const svg = renderChart([createMeasurement('Polish', 0, [10]), createMeasurement('German', 0, [10])]);
    expect(findAll(svg, /d="M (\d+) /g)).toEqual(['342', '386']);
  });

  it('flattens the corners of a bar too short to fit them', () => {
    const svg = renderChart([createMeasurement('Polish', 0, [1000]), createMeasurement('German', 0, [1])]);
    expect(svg).toContain(
      '<path class="series-1" d="M 386 372 L 386 371.89 Q 386 371.77 386.12 371.77 L 409.89 371.77 Q 410 371.77 410 371.89 L 410 372 Z" />',
    );
  });

  it('lists the legend in first-seen order, advancing by the width of each label', () => {
    const svg = renderChart([createMeasurement('English (US)', 0, [10]), createMeasurement('Polish', 0, [10])]);
    expect(svg).toContain('<rect class="series-0" x="24" y="63" width="10" height="10" rx="2" />');
    expect(svg).toContain('<text class="legend-label" x="40" y="73">English (US)</text>');
    expect(svg).toContain('<rect class="series-1" x="145" y="63" width="10" height="10" rx="2" />');
    expect(svg).toContain('<text class="legend-label" x="161" y="73">Polish</text>');
  });

  it('orders the blanks groups ascending, whatever order the measurements arrive in', () => {
    const svg = renderChart([
      createMeasurement('Polish', 2, [10]),
      createMeasurement('Polish', 0, [10]),
      createMeasurement('Polish', 1, [10]),
    ]);
    expect(findAll(svg, /class="group-label"[^>]*>([^<]+)</g)).toEqual(['0 blanks', '1 blank', '2 blanks']);
    expect(svg).toContain('<text class="group-label" text-anchor="middle" x="162.67" y="394">0 blanks</text>');
  });

  it('labels the scale in seconds, drawing the axis at zero and grid lines above it', () => {
    const svg = renderChart([createMeasurement('Polish', 0, [1000])]);
    expect(findAll(svg, /class="tick-label"[^>]*>([^<]+)</g)).toEqual([
      '0',
      '0.2s',
      '0.4s',
      '0.6s',
      '0.8s',
      '1s',
      '1.2s',
    ]);
    expect(findAll(svg, /<line class="(\w+)"/g)).toEqual(['axis', 'grid', 'grid', 'grid', 'grid', 'grid', 'grid']);
  });

  it('never picks more than six intervals, whatever the magnitude', () => {
    for (const duration of [50, 66, 137, 480, 2600, 9000, 74000]) {
      const svg = renderChart([createMeasurement('Polish', 0, [duration])]);
      expect(findAll(svg, /<line class="(\w+)"/g).length).toBeLessThanOrEqual(7);
    }
  });

  it('keeps the tallest bar below the top tick', () => {
    const svg = renderChart([createMeasurement('Polish', 0, [100])]);
    const [topGridLine] = findAll(svg, /<line class="grid"[^>]* y1="([\d.]+)"/g).toReversed();
    const [valueLabelY] = findAll(svg, /class="value-label"[^>]* y="([\d.]+)"/g);
    expect(Number(topGridLine)).toBeLessThan(Number(valueLabelY));
  });

  it('throws when a series has no measurement for a blanks count that another series has', () => {
    const measurements = [
      createMeasurement('Polish', 0, [10]),
      createMeasurement('Polish', 1, [10]),
      createMeasurement('German', 0, [10]),
    ];
    expect(() => renderChart(measurements)).toThrow('Missing measurement for "German" with 1 blanks');
  });

  it('throws when every duration is zero, since no scale can be derived from it', () => {
    expect(() => renderChart([createMeasurement('Polish', 0, [0])])).toThrow('Cannot pick a tick step for 0');
  });

  it('labels every tick with its own value when the scale is too small for seconds', () => {
    const svg = renderChart([createMeasurement('Polish', 0, [20])]);

    expect(findAll(svg, /class="tick-label"[^>]*>([^<]+)</g)).toEqual(['0', '5ms', '10ms', '15ms', '20ms', '25ms']);
  });
});

function createMeasurement(label: string, blanksCount: number, durations: number[]): Measurement {
  return { blanksCount, durations, label, locale: Locale.EN_US, resultsCount: 1 };
}

function findAll(text: string, pattern: RegExp): string[] {
  return [...text.matchAll(pattern)].map(([, match]) => match);
}
