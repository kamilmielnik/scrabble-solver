import { describe, expect, it } from 'bun:test';

import { Locale } from './Locale';

describe('Locale', () => {
  it('keeps the IETF tags stored in settings and sent to the API', () => {
    const entries: [string, string][] = Object.entries(Locale);

    expect(entries).toEqual([
      ['DE_DE', 'de-DE'],
      ['EN_GB', 'en-GB'],
      ['EN_US', 'en-US'],
      ['ES_ES', 'es-ES'],
      ['FA_IR', 'fa-IR'],
      ['FR_FR', 'fr-FR'],
      ['PL_PL', 'pl-PL'],
      ['RO_RO', 'ro-RO'],
      ['TR_TR', 'tr-TR'],
    ]);
  });
});
