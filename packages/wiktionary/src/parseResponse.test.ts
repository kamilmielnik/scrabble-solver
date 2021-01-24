import fs from 'fs';
import path from 'path';

import parseResponse from './parseResponse';

const tests = ['dicare', 'fourty', 'mako', 'man'];

describe('parseResponse', () => {
  tests.forEach((word) => {
    const inputFilepath = path.resolve(__dirname, '__tests__', `${word}.input.json`);
    const outputFilepath = path.resolve(__dirname, '__tests__', `${word}.output.json`);
    const input = fs.readFileSync(inputFilepath, 'utf-8');
    const output = fs.readFileSync(outputFilepath, 'utf-8');

    it(`Extracts "${word}" definitions`, () => {
      expect(parseResponse(input, word).definitions).toEqual(JSON.parse(output));
    });
  });
});
