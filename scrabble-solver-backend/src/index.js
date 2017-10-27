import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { API_HOST, API_PORT } from 'scrabble-solver-commons/constants';
import searchInDictionary from 'endpoints/search-in-dictionary';
import solve from 'endpoints/solve';

const dictionariesDirectiory = process.argv[2] || '../dictionaries';
const locales = fs
  .readdirSync(dictionariesDirectiory)
  .filter((file) => file.endsWith('.txt'))
  .map((file) => file.substring(0, file.length - '.txt'.length));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/dictionary', searchInDictionary);
locales.forEach((locale) => {
  const dictionaryFilePath = path.join(dictionariesDirectiory, `${locale}.txt`);
  const endpoint = solve(dictionaryFilePath);
  app.post(`/api/${locale}/solve`, endpoint);
});

app.listen(API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at ${API_HOST}:${API_PORT}/`);
});
