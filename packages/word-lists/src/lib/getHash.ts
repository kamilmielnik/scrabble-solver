import crypto from 'crypto';

const getHash = (bytes = 8): string => crypto.randomBytes(bytes).toString('hex');

export default getHash;
