export type Event =
  | VisitEvent
  | SolveEvent
  | VerificationEvent
  | DownloadEvent
  | DefinitionEvent
  | BuildEvent
  | ErrorEvent;

export type EventType = Event['type'];

export type EventValue = string | number | boolean | undefined;

export type LoggedEvent = Event & { timestamp: string };

type VisitEvent = {
  type: 'visit';
  ip?: string;
  ua?: string;
  referrer?: string;
  locale?: string;
  game?: string;
};

type SolveEvent = {
  type: 'solve';
  ip?: string;
  ms: number;
  locale: string;
  game: string;
  tiles: number;
  blanks: number;
  rack: string;
  board: string;
  results: number;
};

type VerificationEvent = {
  type: 'verification';
  ip?: string;
  ms: number;
  locale: string;
  game: string;
  tiles: number;
  blanks: number;
  board: string;
  valid: number;
  invalid: number;
};

type DownloadEvent = {
  type: 'download';
  ip?: string;
  ms: number;
  locale: string;
  status: number;
  encoding: 'gzip' | 'identity';
  bytes: number;
};

type DefinitionEvent = {
  type: 'definition';
  ip?: string;
  ms: number;
  locale: string;
  word: string;
  found: boolean;
};

type BuildEvent = {
  type: 'build';
  locale: string;
  words: number;
  download_ms: number;
  build_ms: number;
};

type ErrorEvent = {
  type: 'error';
  level: 'error' | 'warn';
  operation: string;
  locale?: string;
  ip?: string;
  ua?: string;
  message: string;
  stack?: string;
  input?: string;
};

type FieldsOf<T extends EventType> = Exclude<keyof Extract<Event, { type: T }>, 'type'>;

// Field order is the column order of the exported CSV files - append only, never reorder.
export const EVENT_FIELDS = {
  visit: ['ip', 'ua', 'referrer', 'locale', 'game'],
  solve: ['ip', 'ms', 'locale', 'game', 'tiles', 'blanks', 'rack', 'board', 'results'],
  verification: ['ip', 'ms', 'locale', 'game', 'tiles', 'blanks', 'board', 'valid', 'invalid'],
  download: ['ip', 'ms', 'locale', 'status', 'encoding', 'bytes'],
  definition: ['ip', 'ms', 'locale', 'word', 'found'],
  build: ['locale', 'words', 'download_ms', 'build_ms'],
  error: ['level', 'operation', 'locale', 'ip', 'ua', 'message', 'stack', 'input'],
} as const satisfies { [T in EventType]: readonly FieldsOf<T>[] };

type UnlistedFields = { [T in EventType]: Exclude<FieldsOf<T>, (typeof EVENT_FIELDS)[T][number]> }[EventType];

type Assert<T extends never> = T;

export type EveryFieldIsListed = Assert<UnlistedFields>;
