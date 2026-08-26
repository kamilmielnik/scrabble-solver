import { formatEventLine } from './logEvent';

const NOW = new Date('2026-08-23T02:09:02.123Z');

describe('formatEventLine', () => {
  it('orders keys as timestamp, type, then the declared fields', () => {
    const line = formatEventLine(
      {
        type: 'solve',
        results: 312,
        board: '|||||             wriest',
        rack: 'p,z, ,c,v,m,t',
        blanks: 4,
        tiles: 61,
        game: 'scrabble',
        locale: 'en-US',
        ms: 14,
        ip: '203.0.113.7',
      },
      NOW,
    );

    expect(Object.keys(JSON.parse(line) as Record<string, unknown>)).toEqual([
      'timestamp',
      'type',
      'ip',
      'ms',
      'locale',
      'game',
      'tiles',
      'blanks',
      'rack',
      'board',
      'results',
    ]);
  });

  it('formats the timestamp in UTC with seconds precision', () => {
    const line = formatEventLine({ type: 'build', locale: 'pl-PL', words: 3, download_ms: 1, build_ms: 2 }, NOW);

    expect(line).toBe(
      '{"timestamp":"2026-08-23T02:09:02Z","type":"build","locale":"pl-PL","words":3,"download_ms":1,"build_ms":2}\n',
    );
  });

  it('omits undefined fields', () => {
    const line = formatEventLine({ type: 'visit', ip: '::1', referrer: undefined }, NOW);

    expect(line).toBe('{"timestamp":"2026-08-23T02:09:02Z","type":"visit","ip":"::1"}\n');
  });

  it('keeps multi-line values on a single line', () => {
    const line = formatEventLine(
      { type: 'error', level: 'error', operation: 'solve', message: 'Error: boom', stack: 'Error: boom\n    at solve' },
      NOW,
    );

    expect(line.endsWith('\n')).toBe(true);
    expect(line.slice(0, -1)).not.toContain('\n');
  });
});
