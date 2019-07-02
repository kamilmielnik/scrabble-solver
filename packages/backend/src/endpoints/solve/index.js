import fs from 'fs';
import * as configs from '@scrabble-solver/configs';
import { Board, Config, Tile } from '@scrabble-solver/models';
import Solver from '@scrabble-solver/solver';
import Trie from '@scrabble-solver/trie';
import { validateBoard, validateConfigId } from './validate';

export default (locale, filepath) => {
  const collection = createCollection(filepath);

  return (request, response) => {
    try {
      const { board, config, tiles } = parseRequest(request, locale);
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

const createCollection = (filepath) => {
  const serialized = fs.readFileSync(filepath, 'utf-8');
  return Trie.deserialize(serialized);
};

const parseRequest = (request, locale) => {
  const { board, configId, tiles } = request.body;
  validateConfigId(configId);
  const config = new Config(configs[configId][locale]);
  validateBoard(board, config);

  return {
    board: Board.fromJson(board),
    config,
    tiles: (tiles || []).map(Tile.fromJson)
  };
};
