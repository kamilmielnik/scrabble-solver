const MAX_WORD_LENGTH = 15;
const VALID_LOCALES = ['en-GB', 'en-US', 'pl-PL'];

export const validateLocale = (locale) => {
  if (typeof locale !== 'string') {
    throw new Error('Invalid "locale" parameter: not a string');
  }

  if (!VALID_LOCALES.includes(locale)) {
    throw new Error(`Invalid "locale" parameter: must be one of: ${VALID_LOCALES.join(', ')}`);
  }
};

export const validateWord = (word) => {
  if (typeof word !== 'string') {
    throw new Error('Invalid "word" parameter: not a string');
  }

  if (word.length === 0) {
    throw new Error('Invalid "word" parameter: empty string');
  }

  if (word.length > MAX_WORD_LENGTH) {
    throw new Error('Invalid "word" parameter: word too long');
  }
};
