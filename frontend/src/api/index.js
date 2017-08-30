import { API_URL } from 'scrabble-solver-commons/dist/constants';

export const getWordDefinition = (word) => fetch(`${API_URL}/dictionary/${word}`)
  .then((response) => response.json());

export const postSolve = (payload) => fetch(`${API_URL}/solve`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then((response) => response.json());
