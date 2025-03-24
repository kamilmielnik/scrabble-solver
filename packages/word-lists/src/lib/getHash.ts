import crypto from 'crypto';

export const getHash = (bytes = 8): string => crypto.randomBytes(bytes).toString('hex');
