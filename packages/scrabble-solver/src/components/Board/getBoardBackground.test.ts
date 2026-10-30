import { getConfig } from '@scrabble-solver/configs';
import { BONUS_WORD } from '@scrabble-solver/constants';
import { Config, Game, Locale } from '@scrabble-solver/types';

import { getBoardBackground } from './getBoardBackground';

const config = getConfig(Game.Scrabble, Locale.EN_US);

describe('getBoardBackground', () => {
  it('returns an SVG data URL', () => {
    const url = getBoardBackground({ config, direction: 'ltr' });

    expect(url).toStartWith('data:image/svg+xml,');
    expect(decode(url)).toStartWith('<svg height="1254" viewBox="0 0 1254 1254" width="1254"');
    expect(decode(url)).toEndWith('</svg>');
  });

  it('caches per config and direction', () => {
    const ltr = getBoardBackground({ config, direction: 'ltr' });
    const rtl = getBoardBackground({ config, direction: 'rtl' });

    expect(getBoardBackground({ config, direction: 'ltr' })).toBe(ltr);
    expect(getBoardBackground({ config, direction: 'rtl' })).toBe(rtl);
    expect(rtl).not.toBe(ltr);
  });

  it('scales with the board of the game', () => {
    const svg = decode(getBoardBackground({ config: getConfig(Game.SuperScrabble, Locale.EN_US), direction: 'ltr' }));

    expect(svg).toContain('width="1740"');
  });

  it('draws a grid line between every row and column plus the coordinate edges', () => {
    const svg = decode(getBoardBackground({ config, direction: 'ltr' }));

    expect(svg.match(/<line /g)).toHaveLength(2 + 14 + 14);
  });

  it('draws one mark per bonus', () => {
    const svg = decode(getBoardBackground({ config, direction: 'ltr' }));

    expect(svg.match(/<use /g)).toHaveLength(config.bonuses.length);
  });

  it('offsets cells by the coordinates column on the left in LTR and not in RTL', () => {
    const bonus = config.bonuses[0];
    const ltr = decode(getBoardBackground({ config, direction: 'ltr' }));
    const rtl = decode(getBoardBackground({ config, direction: 'rtl' }));

    expect(ltr).toContain(`x="${40 + bonus.x * 81}" y="${40 + bonus.y * 81}"`);
    expect(rtl).toContain(`x="${bonus.x * 81}" y="${40 + bonus.y * 81}"`);
  });

  it('puts the coordinates column on the right in RTL', () => {
    const rtl = decode(getBoardBackground({ config, direction: 'rtl' }));

    expect(rtl).toContain('width="40" x="1215" y="0"');
  });

  it('marks the centre cell with the start star', () => {
    const svg = decode(getBoardBackground({ config, direction: 'ltr' }));
    const centerX = 40 + 7 * 81;

    expect(svg).toContain(`x="${centerX + 8}" y="${centerX + 8}"`);
    expect(svg).toContain('<path d="M3.612');
  });

  it('labels word multipliers and leaves letter bonuses unlabelled', () => {
    const svg = decode(getBoardBackground({ config: createConfig([2, 3, 4]), direction: 'ltr' }));

    expect(svg).toContain('href="#b2"');
    expect(svg).toContain('href="#b3"');
    expect(svg).toContain('href="#b4"');
    expect(svg).toContain('×4');
  });

  it('draws an unlabelled mark for a word multiplier without a symbol', () => {
    const svg = decode(getBoardBackground({ config: createConfig([5]), direction: 'ltr' }));

    expect(svg).toContain('href="#b"');
  });

  it('draws letter bonuses with the plain symbol', () => {
    const literaki = getConfig(Game.Literaki, Locale.PL_PL);
    const svg = decode(getBoardBackground({ config: literaki, direction: 'ltr' }));

    expect(svg).toContain('href="#b"');
  });
});

function decode(url: string): string {
  return decodeURIComponent(url.replace('data:image/svg+xml,', ''));
}

function createConfig(multipliers: number[]): Config {
  return new Config({
    ...config.config,
    bonuses: multipliers.map((multiplier, x) => ({ multiplier, type: BONUS_WORD, x, y: 0 })),
  });
}
