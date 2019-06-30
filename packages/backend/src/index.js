import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import url from 'url';
import searchEnDictionary from 'endpoints/search-en-dictionary';
import searchPlDictionary from 'endpoints/search-pl-dictionary';
import solve from 'endpoints/solve';

const dictionariesDirectory = process.argv[2] || '../../dictionaries';
const { pathname, port } = url.parse(process.env.API_URL);

const locales = [
  {
    locale: 'en-GB',
    dictionaryEndpoint: searchEnDictionary,
    api: {
      dictionary: `${pathname}/en-GB/dictionary/:word`,
      solve: `${pathname}/en-GB/solve`
    }
  },
  {
    locale: 'en-US',
    dictionaryEndpoint: searchEnDictionary,
    api: {
      dictionary: `${pathname}/en-US/dictionary/:word`,
      solve: `${pathname}/en-US/solve`
    }
  },
  {
    locale: 'pl-PL',
    dictionaryEndpoint: searchPlDictionary,
    api: {
      dictionary: `${pathname}/pl-PL/dictionary`,
      solve: `${pathname}/pl-PL/solve`
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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at ${process.env.API_URL}/`);
});
