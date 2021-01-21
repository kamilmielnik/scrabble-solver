export type Comparator<T> = (a: T, B: T) => number;

export type Translate = (key: keyof Translations) => string;

export interface Translations {
  'cell.set-blank': string;
  'cell.set-not-blank': string;
  'cell.toggle-direction': string;
  clear: string;
  close: string;
  'dictionary.empty-state.no-definitions': string;
  'dictionary.empty-state.no-results': string;
  'dictionary.empty-state.not-allowed': string;
  'dictionary.empty-state.unitialized': string;
  'empty-state.error': string;
  'empty-state.info': string;
  'empty-state.success': string;
  'empty-state.warning': string;
  github: string;
  keyMap: string;
  'keyMap.board': string;
  'keyMap.board.toggle-blank': string;
  'keyMap.board.toggle-direction': string;
  'keyMap.board-and-rack': string;
  'keyMap.board-and-rack.navigate': string;
  'keyMap.board-and-rack.remove-tile': string;
  'keyMap.board-and-rack.submit': string;
  'keyMap.rack': string;
  'keyMap.rack.insert-blank': string;
  loading: string;
  'rack.placeholder': string;
  'results.empty-state.outdated': string;
  'results.empty-state.no-results': string;
  'results.empty-state.unitialized': string;
  'results.header.points': string;
  'results.header.word': string;
  'results.solve': string;
  settings: string;
  'settings.autoGroupTiles': string;
  'settings.autoGroupTiles.left': string;
  'settings.autoGroupTiles.right': string;
  'settings.autoGroupTiles.null': string;
  'settings.game': string;
  'settings.language': string;
}
