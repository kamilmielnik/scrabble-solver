import { Cell } from '../Cell';
import { type ResultJson } from '../ResultJson';
import { Tile } from '../Tile';

export function getPlacedCell(json: ResultJson, placedIndex: number, x: number, y: number): Cell {
  const character = json.tiles[placedIndex];
  const isBlank = json.blankIndices.includes(placedIndex);
  return new Cell({ isEmpty: true, tile: new Tile({ character, isBlank }), x, y });
}
