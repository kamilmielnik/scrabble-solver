import { formatCsvRow } from './formatCsvRow';

describe('formatCsvRow', () => {
  it('joins values with commas and ends the line', () => {
    expect(formatCsvRow(['a', 1, true])).toBe('a,1,true\n');
  });

  it('writes undefined as an empty field', () => {
    expect(formatCsvRow(['a', undefined, 'b'])).toBe('a,,b\n');
  });

  it('quotes fields containing commas', () => {
    expect(formatCsvRow(['x,y'])).toBe('"x,y"\n');
  });

  it('quotes fields containing quotes and doubles them', () => {
    expect(formatCsvRow(['say "hi"'])).toBe('"say ""hi"""\n');
  });

  it('quotes fields containing line breaks', () => {
    expect(formatCsvRow(['Error: boom\n    at solve'])).toBe('"Error: boom\n    at solve"\n');
  });

  it('quotes fields with leading or trailing whitespace', () => {
    expect(formatCsvRow([' ab', 'cd '])).toBe('" ab","cd "\n');
  });

  it('leaves inner whitespace unquoted', () => {
    expect(formatCsvRow(['pz cvmt'])).toBe('pz cvmt\n');
  });

  it('prefixes text a spreadsheet would evaluate as a formula with a quote', () => {
    expect(formatCsvRow(['=HYPERLINK("http://evil","x")', '+1', '-1', '@x', '\tx'])).toBe(
      `"'=HYPERLINK(""http://evil"",""x"")",'+1,'-1,'@x,'\tx\n`,
    );
  });

  it('leaves negative numbers alone', () => {
    expect(formatCsvRow([-1])).toBe('-1\n');
  });
});
