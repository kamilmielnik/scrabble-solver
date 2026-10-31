import { type BoardsState } from './types';

/**
 * Next unused id. Ids are stable strings rather than indices so that removing
 * a board cannot silently re-point another board's persisted snapshot at it.
 */
export const getNextBoardId = ({ order }: Pick<BoardsState, 'order'>): string => {
  for (let index = 1; ; ++index) {
    const id = `board-${index}`;

    if (!order.includes(id)) {
      return id;
    }
  }
};

/**
 * Which board to show after removing `id` -- the one to its right, or to its
 * left when removing the last tab, which is what a tab strip usually does.
 */
export const getNextActiveBoardId = ({ id, order }: { id: string; order: string[] }): string | undefined => {
  const index = order.indexOf(id);

  if (index === -1 || order.length <= 1) {
    return undefined;
  }

  return order[index + 1] ?? order[index - 1];
};
