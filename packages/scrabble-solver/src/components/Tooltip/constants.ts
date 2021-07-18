import styles from './Tooltip.module.scss';

const ARROW_SIZE = parseInt(styles.ARROW_SIZE, 10);
const OFFSET = parseInt(styles.OFFSET, 10);
const PREVENT_OVERFLOW = parseInt(styles.PREVENT_OVERFLOW, 10);

export const MODIFIERS = [
  {
    name: 'preventOverflow',
    options: {
      padding: PREVENT_OVERFLOW,
      rootBoundary: 'document',
    },
  },
  {
    name: 'flip',
    options: {
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
