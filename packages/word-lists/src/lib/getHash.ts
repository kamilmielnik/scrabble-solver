import crypto from 'crypto';

const getHash = (bytes = 8) => crypto.randomBytes(bytes).toString('hex');

export default getHash;
