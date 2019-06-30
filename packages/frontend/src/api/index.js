export const getWordDefinition = (locale, word) =>
  fetch(`${process.env.REACT_APP_API_URL}/${locale}/dictionary/${word.toLowerCase()}`).then((response) => response.json());

export const postSolve = (locale, payload) =>
  fetch(`${process.env.REACT_APP_API_URL}/${locale}/solve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then((response) => response.json());
