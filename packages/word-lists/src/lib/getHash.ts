import crypto from 'crypto';

const getHash = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');

export default getHash;
