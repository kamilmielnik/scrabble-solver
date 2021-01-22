import fs from 'fs';

const readFile = async (filepath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, { encoding: 'utf-8' }, (error, data) => {
      if (error) {
        reject();
      } else {
        resolve(data.toString());
      }
    });
  });
};

export default readFile;
