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
}
export type TranslationKey =
  | 'cell.enter-word'
  | 'cell.filter-cell'
  | 'cell.set-blank'
  | 'cell.set-not-blank'
  | 'cell.tile.location'
  | 'cell.toggle-direction'
  | 'common.blanks'
  | 'common.clear'
  | 'common.close'
  | 'common.consonants'
  | 'common.loading'
  | 'common.next'
  | 'common.points'
  | 'common.previous'
  | 'common.tiles'
  | 'common.two-letter-tiles'
  | 'common.vowels'
  | 'common.word'
  | 'common.words'
  | 'dictionary.empty-state.no-definitions'
  | 'dictionary.empty-state.no-results'
  | 'dictionary.empty-state.not-allowed'
  | 'dictionary.empty-state.uninitialized'
  | 'dictionary.input.placeholder'
  | 'dictionary.input.title'
  | 'dictionary'
  | 'empty-state.error'
  | 'empty-state.info'
  | 'empty-state.success'
  | 'empty-state.warning'
  | 'github'
  | 'keyMap.board-and-rack.insert-two-letter-tile'
  | 'keyMap.board-and-rack.navigate'
  | 'keyMap.board-and-rack.remove-tile'
  | 'keyMap.board-and-rack.submit'
  | 'keyMap.board-and-rack'
  | 'keyMap.board.toggle-blank'
  | 'keyMap.board.toggle-direction'
  | 'keyMap.board'
  | 'keyMap.rack.insert-blank'
  | 'keyMap.rack'
  | 'keyMap'
  | 'menu'
  | 'rack.placeholder'
  | 'rack.tile.location'
  | 'rack.touchscreen.placeholder'
  | 'remaining-tiles'
  | 'results.empty-state.no-results'
  | 'results.empty-state.outdated'
  | 'results.empty-state.uninitialized'
  | 'results.input.placeholder'
  | 'results.insert'
  | 'results.preview'
  | 'results.solve'
  | 'results'
  | 'settings.autoGroupTiles.left'
  | 'settings.autoGroupTiles.null'
  | 'settings.autoGroupTiles.right'
  | 'settings.autoGroupTiles'
  | 'settings.game'
  | 'settings.inputMode.keyboard'
  | 'settings.inputMode.touchscreen'
  | 'settings.inputMode'
  | 'settings.language'
  | 'settings'
  | 'words.invalid'
  | 'words.valid'
  | 'words';

export type Translate = (key: TranslationKey, replacements?: Record<string, string>) => string;

export type Translations = Record<TranslationKey, string>;
