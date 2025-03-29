import { Config } from '@scrabble-solver/types';

// eslint-disable-next-line no-warning-comments
// TODO: https://github.com/kamilmielnik/scrabble-solver/issues/393
import { extractCharacters } from '../../../../lib/extractCharacters';

export const extractRack = (config: Config, value: string): (string | null)[] => {
  const charactersByCase = extractCharacters(config, value, {
    /**
     * This is to allow inserting digraphs on the rack in touchscreen input mode.
     * This is not necessary on the board.
     */
    upperCaseDigraphsOnly: true,
  });
  const characters = Array.from({ length: config.rackSize }, (_, index) => {
    return typeof charactersByCase[index] === 'string' ? charactersByCase[index] : null;
  });
  return characters;
};
