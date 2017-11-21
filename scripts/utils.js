import decompress from 'decompress';
import fs from 'fs-extra';
import http from 'http';
import https from 'https';
import path from 'path';
import request from 'request';
import url from 'url';

const YELLOW = '\x1b[33m%s\x1b[0m';
const RED = '\x1b[31m%s\x1b[0m';
const GREEN = '\x1b[32m%s\x1b[0m';

// eslint-disable-next-line no-console
export const log = (message) => console.log(YELLOW, message);
// eslint-disable-next-line no-console
export const logError = (error) => console.log(RED, error);
// eslint-disable-next-line no-console
export const logSuccess = (message) => console.log(GREEN, message);
export const logAsyncAction = (message, action) => {
  let result = null;
  try {
    const start = Date.now();
    log(`${message}...`);
    result = action();
    Promise.resolve(result).then((promiseResult) => {
      const end = Date.now();
      const time = end - start;
      logSuccess(`[${time}ms] ${message} successful`);
      return promiseResult;
    });
  } catch (error) {
    logError(`${message} failed\n\t${error}`);
    throw error;
  }
  return result;
};
export const logAction = (message, action) => {
  let result = null;
  try {
    log(`${message}...`);
    const start = Date.now();
    result = action();
    const end = Date.now();
    const time = end - start;
    logSuccess(`[${time}ms] ${message} successful`);
  } catch (error) {
    logError(`${message} failed\n\t${error}`);
    throw error;
  }
  return result;
};

export const getFilenameFromUrl = (fileUrl) => path.basename(url.parse(fileUrl).pathname);

export const downloadHtml = (url) => logAsyncAction(
  `Downloading HTML from "${url}"`,
  () => new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      let data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
    });
  })
);

export const downloadFile = (url, outputFilepath) => logAsyncAction(
  `Downloading file from "${url}"`,
  () => new Promise(
    (resolve) => request
      .get(url, resolve)
      .pipe(fs.createWriteStream(outputFilepath))
  )
);

export const unzipFile = (zipFilepath, filename) => logAsyncAction(
  `Unzipping "${filename}" from "${zipFilepath}"`,
  () => decompress(zipFilepath, '.', {
    filter: (file) => file.path === filename
  })
);

export const readFile = (filepath) => logAction(
  `Reading "${filepath}"`,
  () => fs.readFileSync(filepath, 'utf-8')
);

export const writeFile = (filepath, data) => logAction(
  `Writing "${filepath}"`,
  () => fs.writeFileSync(filepath, data)
);

export const removeFile = (filepath) => logAction(
  `Removing "${filepath}"`,
  () => fs.removeSync(filepath)
);

export const createDirectory = (filepath) => logAction(
  `Making sure "${filepath}" directory exists`,
  () => {
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }
  }
);
