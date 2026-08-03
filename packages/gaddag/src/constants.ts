/** Letter index reserved for the GADDAG separator (◇). */
export const SEPARATOR = 0;

/** Letters are stored on 6 bits (1..63); 0 is the separator. */
export const MAX_LETTERS = 63;

/** Words longer than this are skipped — they cannot fit on any board. */
export const MAX_WORD_LENGTH = 63;

/** Arc label bit marking the last arc of a state. */
export const LAST_ARC_FLAG = 128;

/** Mask extracting the letter from an arc label. */
export const LETTER_MASK = 63;

/** "GDG1" magic number opening the binary serialization format. */
export const MAGIC = 0x31474447;
