import * as dictionaries from './dictionaries';
import * as games from './games';
import * as locales from './locales';

const localesMap = Object.fromEntries(Object.values(locales).map((configs) => [configs[0].locale, configs]));

export { default as getConfig } from './getConfig';
export { default as hasConfig } from './hasConfig';
export { dictionaries, games, locales, localesMap };
