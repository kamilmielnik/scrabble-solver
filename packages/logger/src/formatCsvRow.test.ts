import { formatCsvRow } from './formatCsvRow';

describe('formatCsvRow', () => {
  describe('values', () => {
    it('joins values with commas and ends the line', () => {
      expect(formatCsvRow(['a', 1, true])).toBe('a,1,true\n');
    });

    it('writes undefined as an empty field', () => {
      expect(formatCsvRow(['a', undefined, 'b'])).toBe('a,,b\n');
    });

    it('writes numbers and booleans as they are, including falsy ones', () => {
      expect(formatCsvRow([0, 1.5, 3200000, false, true])).toBe('0,1.5,3200000,false,true\n');
    });

    it('writes an empty string as an empty field', () => {
      expect(formatCsvRow(['', 'a', ''])).toBe(',a,\n');
    });

    it('writes an empty row as an empty line', () => {
      expect(formatCsvRow([])).toBe('\n');
    });

    it('keeps every column of a row made of missing values', () => {
      expect(formatCsvRow([undefined, undefined, undefined])).toBe(',,\n');
    });
  });

  describe('quoting', () => {
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

    it('quotes fields containing carriage returns', () => {
      expect(formatCsvRow(['a\rb', 'a\r\nb'])).toBe('"a\rb","a\r\nb"\n');
    });

    it('escapes every kind of special character in a single field', () => {
      expect(formatCsvRow(['a,"b"\nc'])).toBe('"a,""b""\nc"\n');
    });

    it('quotes a field that is a lone quote', () => {
      expect(formatCsvRow(['"'])).toBe('""""\n');
    });

    it('quotes fields with trailing line breaks or tabs', () => {
      expect(formatCsvRow(['ab\n', 'cd\t'])).toBe('"ab\n","cd\t"\n');
    });

    it('prefixes a formula and quotes it when it contains a comma', () => {
      expect(formatCsvRow(['=SUM(1,2)'])).toBe(`"'=SUM(1,2)"\n`);
    });

    it('leaves non-ASCII text unquoted', () => {
      expect(formatCsvRow(['żółć', 'سلام', 'ch'])).toBe('żółć,سلام,ch\n');
    });
  });

  describe('formulas', () => {
    it('prefixes text a spreadsheet would evaluate as a formula with a quote', () => {
      expect(formatCsvRow(['=HYPERLINK("http://evil","x")', '+1', '-1', '@x', '\tx'])).toBe(
        `"'=HYPERLINK(""http://evil"",""x"")",'+1,'-1,'@x,'\tx\n`,
      );
    });

    it('leaves negative numbers alone', () => {
      expect(formatCsvRow([-1])).toBe('-1\n');
    });

    it('prefixes a leading carriage return, which a spreadsheet would strip before evaluating', () => {
      expect(formatCsvRow(['\r=1+1'])).toBe(`"'\r=1+1"\n`);
    });

    it('prefixes strings that look like signed numbers, unlike the numbers themselves', () => {
      expect(formatCsvRow(['-1', -1, '+1', 1])).toBe(`'-1,-1,'+1,1\n`);
    });

    it('leaves formula characters alone anywhere but the start', () => {
      expect(formatCsvRow(['a=b', 'a+b', 'a-b', 'a@b.com'])).toBe('a=b,a+b,a-b,a@b.com\n');
    });
  });
});
