import { describeError } from './describeError';

describe('describeError', () => {
  it('prefixes the message with the error name and keeps the stack', () => {
    const { message, stack } = describeError(new Error('boom'));

    expect(message).toBe('Error: boom');
    expect(stack).toStartWith('Error: boom\n');
  });

  it('includes the error code', () => {
    const error = Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:443'), { code: 'ECONNREFUSED' });

    expect(describeError(error).message).toBe('Error [ECONNREFUSED]: connect ECONNREFUSED 127.0.0.1:443');
  });

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

  it('stringifies values that are not errors without a stack', () => {
    expect(describeError('boom')).toEqual({ message: 'boom', stack: undefined });
    expect(describeError(undefined)).toEqual({ message: 'undefined', stack: undefined });
  });
});
