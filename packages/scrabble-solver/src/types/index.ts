export type Comparator<T> = (a: T, B: T) => number;

export type AutoGroupTiles = 'left' | 'right' | null;

export type Direction = 'horizontal' | 'vertical';

export type InputMode = 'keyboard' | 'touchscreen';

export interface Point {
  x: number;
  y: number;
}

export type Rack = (string | null)[];

export interface Sort {
  column: ResultColumn;
  direction: SortDirection;
}

export enum SortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
}

export interface RemainingTile {
  character: string;
  count: number;
  score: number;
  usedCount: number;
}

export interface RemainingTilesGroup {
  remainingCount: number;
  tiles: RemainingTile[];
  translationKey: TranslationKey;
  totalCount: number;
}

export enum ResultColumn {
  BlanksCount = 'blanks-count',
  ConsonantsCount = 'consonants-count',
  Points = 'points',
  TilesCount = 'tiles-count',
  VowelsCount = 'vowels-count',
  Word = 'word',
  WordsCount = 'words-count',
  Coordinates = 'coordinates',
}
export type TranslationKey =
  | 'cell.enter-word'
  | 'cell.filter-cell'
  | 'cell.set-blank'
  | 'cell.set-not-blank'
  | 'cell.toggle-direction'
  | 'cell.tile.location'
  | 'common.clear'
  | 'common.close'
  | 'common.coordinates'
  | 'common.loading'
  | 'common.blanks'
  | 'common.consonants'
  | 'common.next'
  | 'common.points'
  | 'common.previous'
  | 'common.tiles'
  | 'common.two-letter-tiles'
  | 'common.vowels'
  | 'common.word'
  | 'common.words'
  | 'dictionary'
  | 'dictionary.empty-state.no-definitions'
  | 'dictionary.empty-state.no-results'
  | 'dictionary.empty-state.not-allowed'
  | 'dictionary.empty-state.uninitialized'
  | 'dictionary.input.placeholder'
  | 'dictionary.input.title'
  | 'empty-state.error'
  | 'empty-state.info'
  | 'empty-state.success'
  | 'empty-state.warning'
  | 'github'
  | 'keyMap'
  | 'keyMap.board'
  | 'keyMap.board.toggle-blank'
  | 'keyMap.board.toggle-direction'
  | 'keyMap.board-and-rack'
  | 'keyMap.board-and-rack.insert-two-letter-tile'
  | 'keyMap.board-and-rack.navigate'
  | 'keyMap.board-and-rack.remove-tile'
  | 'keyMap.board-and-rack.submit'
  | 'keyMap.rack'
  | 'keyMap.rack.insert-blank'
  | 'menu'
  | 'rack.placeholder'
  | 'rack.tile.location'
  | 'rack.touchscreen.placeholder'
  | 'remaining-tiles'
  | 'results'
  | 'results.empty-state.no-results'
  | 'results.empty-state.outdated'
  | 'results.empty-state.uninitialized'
  | 'results.input.placeholder'
  | 'results.insert'
  | 'results.preview'
  | 'results.solve'
  | 'settings'
  | 'settings.autoGroupTiles'
  | 'settings.autoGroupTiles.left'
  | 'settings.autoGroupTiles.right'
  | 'settings.autoGroupTiles.null'
  | 'settings.game'
  | 'settings.inputMode'
  | 'settings.inputMode.keyboard'
  | 'settings.inputMode.touchscreen'
  | 'settings.language'
  | 'words'
  | 'words.invalid'
  | 'words.valid';

export type Translate = (key: TranslationKey, replacements?: Record<string, string>) => string;

export type Translations = Record<TranslationKey, string>;
