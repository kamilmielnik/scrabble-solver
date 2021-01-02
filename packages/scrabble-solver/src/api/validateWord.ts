const validateWord = (word: unknown): void => {
  if (typeof word !== 'string') {
    throw new Error('"word" is not a string');
  }

  if (word.length === 0) {
    throw new Error('"word" is an empty string');
  }
};

export default validateWord;
