import fs from 'fs';

const ensureDirectoryExists = (filepath: string): void => {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
};

export default ensureDirectoryExists;
