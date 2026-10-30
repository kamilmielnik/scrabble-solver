import { describeError } from './describeError';

describe('describeError', () => {
  describe('heading', () => {
    it('prefixes the message with the error name and keeps the stack', () => {
      const { message, stack } = describeError(new Error('boom'));

      expect(message).toBe('Error: boom');
      expect(stack).toStartWith('Error: boom\n');
    });

    it('includes the error code', () => {
      const error = Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:443'), { code: 'ECONNREFUSED' });

      expect(describeError(error).message).toBe('Error [ECONNREFUSED]: connect ECONNREFUSED 127.0.0.1:443');
    });

    it('uses the name of an error subclass', () => {
      expect(describeError(new TypeError('boom')).message).toBe('TypeError: boom');
    });

    it('uses a custom error name', () => {
      const error = Object.assign(new Error('boom'), { name: 'BadRequestError' });

      expect(describeError(error).message).toBe('BadRequestError: boom');
    });

    it('leaves no trailing whitespace after an empty message', () => {
      expect(describeError(new Error('')).message).toBe('Error:');
    });

    it('includes the code in the heading of an error with an empty message', () => {
      const error = Object.assign(new Error(''), { code: 'ENOENT' });

      expect(describeError(error).message).toBe('Error [ENOENT]:');
    });

    it('ignores codes that are not strings', () => {
      const error = Object.assign(new Error('boom'), { code: 500 });

      expect(describeError(error).message).toBe('Error: boom');
    });
  });

  describe('nested errors', () => {
    it('lists the errors behind an AggregateError with an empty message', () => {
      const error = Object.assign(
        new AggregateError(
          [
            Object.assign(new Error('connect ECONNREFUSED ::1:443'), { code: 'ECONNREFUSED' }),
            Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:443'), { code: 'ECONNREFUSED' }),
          ],
          '',
        ),
        { code: 'ECONNREFUSED' },
      );

      expect(describeError(error).message).toBe(
        'AggregateError [ECONNREFUSED]: (Error [ECONNREFUSED]: connect ECONNREFUSED ::1:443; Error [ECONNREFUSED]: connect ECONNREFUSED 127.0.0.1:443)',
      );
    });

    it('includes the cause', () => {
      const error = new Error('Could not download word list', { cause: new TypeError('fetch failed') });

      expect(describeError(error).message).toBe('Error: Could not download word list (TypeError: fetch failed)');
    });

    it('follows a chain of causes', () => {
      const socketError = Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' });
      const fetchError = new TypeError('fetch failed', { cause: socketError });
      const error = new Error('Could not download word list', { cause: fetchError });

      expect(describeError(error).message).toBe(
        'Error: Could not download word list (TypeError: fetch failed (Error [ECONNRESET]: socket hang up))',
      );
    });

    it('describes a cause that is not an error', () => {
      expect(describeError(new Error('boom', { cause: 'timeout' })).message).toBe('Error: boom (timeout)');
    });

    it('keeps a falsy cause', () => {
      expect(describeError(new Error('boom', { cause: 0 })).message).toBe('Error: boom (0)');
    });

    it('treats an undefined cause as no cause', () => {
      expect(describeError(new Error('boom', { cause: undefined })).message).toBe('Error: boom');
    });

    it('keeps the heading of an AggregateError with a message and no errors', () => {
      const error = new AggregateError([], 'nothing happened');

      expect(describeError(error).message).toBe('AggregateError: nothing happened');
    });

    it('separates the message of an AggregateError from the errors behind it', () => {
      const error = new AggregateError([new Error('first'), 'second'], 'both failed');

      expect(describeError(error).message).toBe('AggregateError: both failed (Error: first; second)');
    });

    it('describes the cause of an error inside an AggregateError', () => {
      const error = new AggregateError([new Error('first', { cause: new Error('root') })], 'failed');

      expect(describeError(error).message).toBe('AggregateError: failed (Error: first (Error: root))');
    });

    it.todo('describes an error whose cause chain loops back on itself instead of overflowing the stack');
  });

  describe('values that are not errors', () => {
    it('stringifies values that are not errors without a stack', () => {
      expect(describeError('boom')).toEqual({ message: 'boom', stack: undefined });
      expect(describeError(undefined)).toEqual({ message: 'undefined', stack: undefined });
    });

    it.each([
      ['null', null, 'null'],
      ['a number', 42, '42'],
      ['false', false, 'false'],
      ['a symbol', Symbol('boom'), 'Symbol(boom)'],
      ['an object', { message: 'boom' }, '[object Object]'],
      ['an object with its own string form', { toString: () => 'boom' }, 'boom'],
    ])('stringifies %s', (_name, value, message) => {
      expect(describeError(value)).toEqual({ message, stack: undefined });
    });

    it.todo('describes a thrown value that cannot be converted to a string instead of throwing');
  });

  describe('stack', () => {
    it('ignores a stack on a value that is not an error', () => {
      expect(describeError({ stack: 'at solve' }).stack).toBeUndefined();
    });

    it('reports a missing stack on an error', () => {
      const error = Object.assign(new Error('boom'), { stack: undefined });

      expect(describeError(error)).toEqual({ message: 'Error: boom', stack: undefined });
    });

    it('keeps the stack of the outer error only', () => {
      const error = new Error('outer', { cause: new Error('inner') });

      expect(describeError(error).stack).toBe(error.stack);
    });
  });
});
