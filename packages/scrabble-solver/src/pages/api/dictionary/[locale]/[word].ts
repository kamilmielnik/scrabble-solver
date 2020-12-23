import { NextApiRequest, NextApiResponse } from 'next';
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

const parseRequest = (request: NextApiRequest): { locale: Locale; word: string } => ({
  locale: getLocale(request),
  word: getWord(request),
});

const getLocale = (request: NextApiRequest): Locale => {
  if (['en-GB', 'en-US', 'pl-PL'].includes(request.query.locale as string)) {
    throw new Error('Invalid request body');
  }

  return request.query.locale as Locale;
};

const getWord = (request: NextApiRequest): string => {
  if (typeof request.query.word !== 'string') {
    throw new Error('Invalid request query');
  }

  return request.query.word;
};

export default dictionary;
