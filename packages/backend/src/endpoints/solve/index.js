import fs from 'fs';
import path from 'path';
import * as configs from '@scrabble-solver/configs';
import { Board, Tile } from '@scrabble-solver/models';
import Solver from '@scrabble-solver/solver';
import Trie from '@scrabble-solver/trie';

import { validateBoard, validateConfigId, validateLocale, validateTiles } from './validate';

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
      const { board, config, locale, tiles } = parseRequest(request);
      const collection = localeCollections[locale];
      const solver = new Solver(config, collection);
      const results = solver.solve(board, tiles);
      response.send(results.map((result) => result.toJson()));
    } catch (error) {
      response.status(400).send({
        message: error.message
      });
    }
  };
};

const parseRequest = (request) => {
  const { board, configId, locale, tiles } = request.body;
  validateConfigId(configId);
  validateLocale(locale);
  const config = configs[configId][locale];
  validateBoard(board, config);
  validateTiles(tiles, config);

  return {
    board: Board.fromJson(board),
    config,
    locale,
    tiles: tiles.map(Tile.fromJson)
  };
};
