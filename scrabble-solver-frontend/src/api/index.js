import { API_URL } from 'scrabble-solver-commons/constants';

export const getWordDefinition = (locale, word) => fetch(`${API_URL}/${locale}/dictionary/${word.toLowerCase()}`)
  .then((response) => response.json());

export const postSolve = (locale, payload) => fetch(`${API_URL}/${locale}/solve`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then((response) => response.json());
