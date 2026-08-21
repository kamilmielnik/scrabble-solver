import { type ShowCoordinates } from '@scrabble-solver/types';

import { type Comparator } from '@/types';

import { createStringComparator } from './createStringComparator';

interface Parameters<Item> {
  getItemCoordinates: (item: Item, showCoordinates: ShowCoordinates) => string;
  locale: string;
  showCoordinates: ShowCoordinates;
}

export function createCoordinatesComparator<Item>({
  getItemCoordinates,
  locale,
  showCoordinates,
}: Parameters<Item>): Comparator<Item> {
  const stringComparator = createStringComparator(locale);

  return (a, b) => {
    return stringComparator(getItemCoordinates(a, showCoordinates), getItemCoordinates(b, showCoordinates));
  };
}
