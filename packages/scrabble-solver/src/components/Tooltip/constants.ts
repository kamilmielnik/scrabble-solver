import styles from './Tooltip.module.scss';

const ARROW_SIZE = parseInt(styles.ARROW_SIZE, 10);
const OFFSET = parseInt(styles.OFFSET, 10);

export const MODIFIERS = [
  {
    name: 'preventOverflow',
    options: {
      padding: ARROW_SIZE,
      rootBoundary: 'document',
    },
  },
  {
    name: 'flip',
    options: {
      fallbackPlacements: ['top', 'bottom', 'right', 'left'],
      padding: ARROW_SIZE,
      rootBoundary: 'document',
    },
  },
  {
    name: 'offset',
    options: {
      offset: [0, OFFSET + ARROW_SIZE],
    },
  },
];
