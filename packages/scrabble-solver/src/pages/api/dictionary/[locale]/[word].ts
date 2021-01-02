import { NextApiRequest, NextApiResponse } from 'next';

import { validateLocale, validateWord } from 'api';
import { Locale } from 'types';

const dictionary = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  try {
    const { locale, word } = parseRequest(request);
    // TODO: implement me

    response.status(200).send({ locale, word });
  } catch (error) {
    response.status(500).send('Server error');
  }
};

const parseRequest = (request: NextApiRequest): { locale: Locale; word: string } => {
  const { locale, word } = request.query;

  validateLocale(locale);
  validateWord(word);

  return {
    locale: locale as Locale,
    word: word as string,
  };
};

export default dictionary;
