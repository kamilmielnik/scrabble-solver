import getHash from './getHash';

const getTempFilename = (): string => {
  return `/${getHash()}.txt`;
};

export default getTempFilename;
