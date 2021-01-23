import fs from 'fs';

const writeFile = async (filepath: string, data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, (error) => {
      if (error) {
        reject();
      } else {
        resolve();
      }
    });
  });
};

export default writeFile;
