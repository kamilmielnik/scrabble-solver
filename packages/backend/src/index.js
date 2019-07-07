import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import url from 'url';

import dictionary from './endpoints/dictionary';
import solve from './endpoints/solve';

const dictionariesDirectory = process.argv[2] || '../../dictionaries';
const { pathname, port } = url.parse(process.env.API_URL);

const locales = [
  {
    locale: 'en-GB',
    api: {
      solve: `${pathname}/en-GB/solve`
    }
  },
  {
    locale: 'en-US',
    api: {
      solve: `${pathname}/en-US/solve`
    }
  },
  {
    locale: 'pl-PL',
    api: {
      solve: `${pathname}/pl-PL/solve`
    }
  }
];

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(`${pathname}/dictionary`, dictionary);

locales.forEach(({ api, locale }) => {
  const dictionaryFilePath = path.join(dictionariesDirectory, `${locale}.txt`);
  const solveEndpoint = solve(locale, dictionaryFilePath);
  app.post(api.solve, solveEndpoint);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at ${process.env.API_URL}/`);
});
