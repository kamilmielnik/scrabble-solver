import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { API_HOST, API_PORT } from 'scrabble-solver-commons/constants';
import searchInDictionary from 'endpoints/search-in-dictionary';
import solve from 'endpoints/solve';

const dictionaryFilepath = process.argv[2] || '../dictionary.txt';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/dictionary', searchInDictionary);
app.post('/api/solve', solve(dictionaryFilepath));

app.listen(API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at ${API_HOST}:${API_PORT}/`);
});
