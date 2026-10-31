import { describe, expect, it } from 'bun:test';

import { isError } from './isError';

describe('isError', () => {
  it.each([
    ['an error', new Error('x')],
    ['an error subclass', new TypeError('x')],
    ['an error without a message', new Error()],
    ['the error shape sent by the API', { message: 'x' }],
    ['extra fields', { message: 'x', status: 500 }],
  ])('accepts %s', (_name, value) => {
    expect(isError(value)).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['text', 'x'],
    ['a number', 1],
    ['NaN', Number.NaN],
    ['an empty object', {}],
    ['an array', ['x']],
    ['a numeric message', { message: 1 }],
    ['a null message', { message: null }],
    ['a message object', { message: { text: 'x' } }],
  ])('rejects %s', (_name, value) => {
    expect(isError(value)).toBe(false);
  });
});
