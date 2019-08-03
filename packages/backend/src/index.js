import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import url from 'url';
import logger from '@scrabble-solver/logger';

import dictionary from './endpoints/dictionary';
import solve from './endpoints/solve';

const dictionariesDirectory = process.argv[2] || '../../dictionaries';
const { pathname, port } = url.parse(process.env.API_URL);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(`${pathname}/dictionary`, dictionary);
app.post(`${pathname}/solve`, solve(dictionariesDirectory));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  logger.info(`Listening at ${process.env.API_URL}/`);
});
