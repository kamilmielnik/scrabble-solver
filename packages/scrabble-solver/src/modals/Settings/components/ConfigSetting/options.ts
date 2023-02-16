import { literaki, scrabble } from '@scrabble-solver/configs';

interface Option {
  label: string;
  value: typeof literaki.id | typeof scrabble.id;
}

const options: Option[] = [
  {
    label: scrabble.name,
    value: scrabble.id,
  },
  {
    label: literaki.name,
    value: literaki.id,
  },
];

export default options;
