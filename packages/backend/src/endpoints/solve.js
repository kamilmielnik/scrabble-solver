import fs from 'fs';
import { Board, Config, Tile } from '@scrabble-solver/commons/models';
import Solver from '@scrabble-solver/solver';
import Trie from '@scrabble-solver/trie';

export default (filepath) => {
  const collection = createCollection(filepath);

  return (request, response) => {
    const { board, config, tiles } = parseRequest(request);
    const solver = new Solver(config, collection);
    const results = solver.solve(board, tiles);
    response.send(results.map((result) => result.toJson()));
  };
};

const createCollection = (filepath) => {
  const serialized = fs.readFileSync(filepath, 'utf-8');
  return Trie.deserialize(serialized);
};

const parseRequest = ({ body }) => ({
  board: Board.fromJson(body.board),
  config: Config.fromJson(body.config),
  tiles: (body.tiles || []).map(Tile.fromJson)
});
