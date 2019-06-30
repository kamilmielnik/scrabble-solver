import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { API_HOST, API_PORT } from '@scrabble-solver/commons/constants';
import searchEnDictionary from 'endpoints/search-en-dictionary';
import searchPlDictionary from 'endpoints/search-pl-dictionary';
import solve from 'endpoints/solve';

const dictionariesDirectory = process.argv[2] || '../dictionaries';

const locales = [
  {
    locale: 'en-GB',
    dictionaryEndpoint: searchEnDictionary,
    api: {
      dictionary: '/api/en-GB/dictionary/:word',
      solve: '/api/en-GB/solve'
    }
  },
  {
    locale: 'en-US',
    dictionaryEndpoint: searchEnDictionary,
    api: {
      dictionary: '/api/en-US/dictionary/:word',
      solve: '/api/en-US/solve'
    }
  },
  {
    locale: 'pl-PL',
    dictionaryEndpoint: searchPlDictionary,
    api: {
      dictionary: '/api/pl-PL/dictionary',
      solve: '/api/pl-PL/solve'
    }
  }
];

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

locales.forEach(({ api, dictionaryEndpoint, locale }) => {
  const dictionaryFilePath = path.join(dictionariesDirectory, `${locale}.txt`);
  const solveEndpoint = solve(dictionaryFilePath);
  app.post(api.solve, solveEndpoint);
  app.use(api.dictionary, dictionaryEndpoint);
});

app.listen(API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at ${API_HOST}:${API_PORT}/`);
});
