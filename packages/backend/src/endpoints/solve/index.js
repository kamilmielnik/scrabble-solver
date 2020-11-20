import fs from 'fs';
import path from 'path';
import { Trie } from '@kamilmielnik/trie';
import * as configs from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import logger from '@scrabble-solver/logger';
import { Board, Tile } from '@scrabble-solver/models';
import Solver from '@scrabble-solver/solver';

import { validateBoard, validateCharacters, validateConfigId, validateLocale } from './validate';

const getLocaleCollection = (dictionariesDirectory, locale) =>
  Trie.deserialize(fs.readFileSync(path.join(dictionariesDirectory, `${locale}.txt`), 'utf-8'));

export default (dictionariesDirectory) => {
  const localeCollections = ['en-GB', 'en-US', 'pl-PL'].reduce(
    (collections, locale) => ({
      ...collections,
      [locale]: getLocaleCollection(dictionariesDirectory, locale)
    }),
    {}
  );

  return (request, response) => {
    try {
      const { board, characters, config, locale } = parseRequest(request);
      const collection = localeCollections[locale];
      const tiles = characters.map((character) => new Tile({ character, isBlank: character === BLANK }));
      const solver = new Solver(config, collection);
      const results = solver.solve(board, tiles);
      response.send(results.map((result) => result.toJson()));
    } catch (error) {
      logger.error(error);
      response.status(400).send({
        message: error.message
      });
    }
  };
};

const parseRequest = (request) => {
  const { board, characters, configId, locale } = request.body;
  logger.info('solve - parseRequest', { board, configId, locale, characters });
  validateConfigId(configId);
  validateLocale(locale);
  const config = configs[configId][locale];
  validateBoard(board, config);
  validateCharacters(characters, config);

  return {
    board: Board.fromJson(board),
    config,
    locale,
    characters
  };
};
