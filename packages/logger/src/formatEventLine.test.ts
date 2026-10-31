import { type Event, type EventType, EVENT_FIELDS } from './events';
import { formatEventLine } from './logEvent';

const NOW = new Date('2026-08-23T02:09:02.123Z');
const BUILD_EVENT: Event = { type: 'build', locale: 'pl-PL', words: 3, download_ms: 1, build_ms: 2 };

/**
 * The exact line of each event type, with the fields passed in reverse order. The events file and the CSV columns are
 * append-only, so when one of these lines breaks, a column has moved and old rows no longer line up.
 */
const EVERY_EVENT_TYPE: [EventType, Event, string][] = [
  [
    'visit',
    { url: 'u', game: 'g', locale: 'l', referrer: 'r', ua: 'a', ip: 'i', type: 'visit' },
    '{"timestamp":"2026-08-23T02:09:02Z","type":"visit","ip":"i","ua":"a","referrer":"r","locale":"l","game":"g","url":"u"}\n',
  ],
  [
    'solve',
    { results: 8, rack: 'r', blanks: 4, tiles: 3, game: 'g', locale: 'l', ms: 2, ip: 'i', type: 'solve' },
    '{"timestamp":"2026-08-23T02:09:02Z","type":"solve","ip":"i","ms":2,"locale":"l","game":"g","tiles":3,"blanks":4,"rack":"r","results":8}\n',
  ],
  [
    'verify',
    { invalid: 8, valid: 7, blanks: 4, tiles: 3, game: 'g', locale: 'l', ms: 2, ip: 'i', type: 'verify' },
    '{"timestamp":"2026-08-23T02:09:02Z","type":"verify","ip":"i","ms":2,"locale":"l","game":"g","tiles":3,"blanks":4,"valid":7,"invalid":8}\n',
  ],
  [
    'download',
    { bytes: 6, encoding: 'gzip', status: 304, locale: 'l', ms: 2, ip: 'i', type: 'download' },
    '{"timestamp":"2026-08-23T02:09:02Z","type":"download","ip":"i","ms":2,"locale":"l","status":304,"encoding":"gzip","bytes":6}\n',
  ],
  [
    'definition',
    { found: 5, words: 'w', locale: 'l', ms: 2, ip: 'i', type: 'definition' },
    '{"timestamp":"2026-08-23T02:09:02Z","type":"definition","ip":"i","ms":2,"locale":"l","words":"w","found":5}\n',
  ],
  [
    'build',
    { build_ms: 4, download_ms: 3, words: 2, locale: 'l', type: 'build' },
    '{"timestamp":"2026-08-23T02:09:02Z","type":"build","locale":"l","words":2,"download_ms":3,"build_ms":4}\n',
  ],
  [
    'error',
    {
      input: 'n',
      stack: 's',
      message: 'm',
      ua: 'a',
      ip: 'i',
      locale: 'l',
      operation: 'solve',
      level: 'warn',
      type: 'error',
    },
    '{"timestamp":"2026-08-23T02:09:02Z","type":"error","level":"warn","operation":"solve","locale":"l","ip":"i","ua":"a","message":"m","stack":"s","input":"n"}\n',
  ],
];

describe('formatEventLine', () => {
  describe('schema', () => {
    it('orders keys as timestamp, type, then the declared fields', () => {
      const line = formatEventLine(
        {
          type: 'solve',
          results: 312,
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
        'results',
      ]);
    });

    it('pins a line for every declared event type', () => {
      expect(EVERY_EVENT_TYPE.map(([type]) => type).sort()).toEqual(Object.keys(EVENT_FIELDS).sort() as EventType[]);
    });

    it.each(EVERY_EVENT_TYPE)('keeps the field order of a %s event', (_type, event, line) => {
      expect(formatEventLine(event, NOW)).toBe(line);
    });
  });

  describe('timestamp', () => {
    it('formats the timestamp in UTC with seconds precision', () => {
      expect(formatEventLine(BUILD_EVENT, NOW)).toBe(
        '{"timestamp":"2026-08-23T02:09:02Z","type":"build","locale":"pl-PL","words":3,"download_ms":1,"build_ms":2}\n',
      );
    });

    it('truncates the timestamp instead of rounding it up to the next second', () => {
      const line = formatEventLine(BUILD_EVENT, new Date('2026-08-23T02:09:02.999Z'));

      expect(line).toStartWith('{"timestamp":"2026-08-23T02:09:02Z",');
    });

    it('assigns an event near midnight to its UTC year, which names the CSV file', () => {
      const line = formatEventLine(BUILD_EVENT, new Date('2026-12-31T23:30:00-05:00'));

      expect(line).toStartWith('{"timestamp":"2027-01-01T04:30:00Z",');
    });
  });

  describe('values', () => {
    it('omits undefined fields', () => {
      const line = formatEventLine({ type: 'visit', ip: '::1', referrer: undefined }, NOW);

      expect(line).toBe('{"timestamp":"2026-08-23T02:09:02Z","type":"visit","ip":"::1"}\n');
    });

    it('omits fields the event does not have', () => {
      expect(formatEventLine({ type: 'visit' }, NOW)).toBe('{"timestamp":"2026-08-23T02:09:02Z","type":"visit"}\n');
    });

    it('keeps falsy values', () => {
      const line = formatEventLine({ type: 'definition', ip: '', ms: 0, locale: 'pl-PL', words: '', found: 0 }, NOW);

      expect(line).toBe(
        '{"timestamp":"2026-08-23T02:09:02Z","type":"definition","ip":"","ms":0,"locale":"pl-PL","words":"","found":0}\n',
      );
    });

    it('drops fields the event type does not declare', () => {
      const event = { type: 'visit', ip: '::1', rack: 'abc', headers: { cookie: 'secret' } } as Event;

      expect(formatEventLine(event, NOW)).toBe('{"timestamp":"2026-08-23T02:09:02Z","type":"visit","ip":"::1"}\n');
    });

    it('keeps multi-line values on a single line', () => {
      const line = formatEventLine(
        {
          type: 'error',
          level: 'error',
          operation: 'solve',
          message: 'Error: boom',
          stack: 'Error: boom\n    at solve',
        },
        NOW,
      );

      expect(line.endsWith('\n')).toBe(true);
      expect(line.slice(0, -1)).not.toContain('\n');
    });

    it('keeps non-ASCII text readable', () => {
      const line = formatEventLine({ type: 'definition', ms: 1, locale: 'fa-IR', words: 'żółć,سلام', found: 2 }, NOW);

      expect(line).toContain('"words":"żółć,سلام"');
    });
  });
});
