import { formatTimestamp, isTimestamp } from './timestamp';

describe('formatTimestamp', () => {
  it('writes UTC time to the second', () => {
    expect(formatTimestamp(new Date('2026-08-23T02:09:02.123Z'))).toBe('2026-08-23T02:09:02Z');
  });
});

describe('isTimestamp', () => {
  it('accepts what formatTimestamp writes', () => {
    expect(isTimestamp(formatTimestamp(new Date()))).toBe(true);
  });

  it.each([
    ['is not a date', 'oops'],
    ['is empty', ''],
    ['lacks the time', '2026-08-23'],
    ['keeps milliseconds', '2026-08-23T02:09:02.123Z'],
    ['has no time zone', '2026-08-23T02:09:02'],
    ['uses another time zone', '2026-08-23T02:09:02+01:00'],
    ['does not exist', '2026-02-30T02:09:02Z'],
  ])('rejects a value that %s', (_name, value) => {
    expect(isTimestamp(value)).toBe(false);
  });
});
