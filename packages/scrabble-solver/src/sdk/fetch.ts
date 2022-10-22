import { isError } from '@scrabble-solver/types';

const fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  let response: Response;

  try {
    response = await window.fetch(input, init);
  } catch (error) {
    const message = isError(error) ? error.message : 'Unknown error';
    throw new Error(`Network error: ${message}`);
  }

  if (response.ok) {
    return response;
  }

  try {
    const json = await response.json();

    if (isError(json)) {
      throw new Error(json.message);
    }
  } finally {
    // do nothing
  }

  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
};

export default fetch;
